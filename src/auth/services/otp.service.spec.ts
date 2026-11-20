import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { createHmac } from 'node:crypto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OtpChallenge } from '../../users/entities/otp-challenge.entity';
import { OtpService } from './otp.service';

const OTP_SECRET = 'test-secret-for-otp';
const OTP_CODE = '123456';
const MOBILE = '+919876543210';

function hashOtp(mobile: string, code: string): string {
  return createHmac('sha256', OTP_SECRET)
    .update(`${mobile}:${code}`)
    .digest('hex');
}

function makeChallenge(overrides: Partial<OtpChallenge> = {}): OtpChallenge {
  return {
    otp_challenge_id_num: 1,
    row_created_dtm: new Date(),
    row_updated_dtm: new Date(),
    expires_at_dtm: new Date(Date.now() + 5 * 60 * 1000),
    consumed_at_dtm: null,
    user_mobile_num: MOBILE,
    otp_hash: hashOtp(MOBILE, OTP_CODE),
    attempts: 0,
    ...overrides,
  };
}

describe('OtpService.verifyChallenge', () => {
  let service: OtpService;
  let challenge: OtpChallenge;
  let repositoryMock: {
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let queryBuilderMock: {
    setLock: jest.Mock;
    where: jest.Mock;
    getOne: jest.Mock;
  };

  beforeEach(async () => {
    challenge = makeChallenge();

    queryBuilderMock = {
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockImplementation(async () => challenge),
    };

    repositoryMock = {
      create: jest.fn(),
      save: jest.fn().mockImplementation(async (value: OtpChallenge) => value),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    };

    const managerMock = {
      getRepository: jest.fn().mockReturnValue(repositoryMock),
    };

    const dataSourceMock = {
      transaction: jest.fn(
        async (callback: (manager: typeof managerMock) => Promise<unknown>) =>
          callback(managerMock),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: getRepositoryToken(OtpChallenge),
          useValue: repositoryMock,
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue(OTP_SECRET) },
        },
        { provide: DataSource, useValue: dataSourceMock },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('accepts a valid OTP and consumes the challenge', async () => {
    await expect(
      service.verifyChallenge(challenge.otp_challenge_id_num, OTP_CODE),
    ).resolves.toBe(MOBILE);

    expect(challenge.consumed_at_dtm).toBeInstanceOf(Date);
    expect(challenge.attempts).toBe(1);
    expect(queryBuilderMock.setLock).toHaveBeenCalledWith('pessimistic_write');
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('rejects a wrong OTP and increments attempts', async () => {
    await expect(
      service.verifyChallenge(challenge.otp_challenge_id_num, '000000'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(challenge.attempts).toBe(1);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('expires the challenge after five wrong OTP attempts', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await expect(
        service.verifyChallenge(challenge.otp_challenge_id_num, '000000'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    }

    expect(challenge.attempts).toBe(5);
    expect(challenge.expires_at_dtm.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('rejects an expired challenge without incrementing attempts', async () => {
    challenge.expires_at_dtm = new Date(Date.now() - 1_000);

    await expect(
      service.verifyChallenge(challenge.otp_challenge_id_num, OTP_CODE),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(challenge.attempts).toBe(0);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('rejects a consumed challenge', async () => {
    challenge.consumed_at_dtm = new Date();

    await expect(
      service.verifyChallenge(challenge.otp_challenge_id_num, OTP_CODE),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('does not allow a successful OTP to be reused', async () => {
    await expect(
      service.verifyChallenge(challenge.otp_challenge_id_num, OTP_CODE),
    ).resolves.toBe(MOBILE);

    await expect(
      service.verifyChallenge(challenge.otp_challenge_id_num, OTP_CODE),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  });
});
