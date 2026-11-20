import { 
Controller,
Get,
Post,
Body,
Param,
ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
    
    constructor(
        private readonly userService: UsersService,
    ){}

    @Post('/update')
    create(@Body() body: { user_name: string, user_email: string}) {
        return this.userService.create(body);
    }

    @Post('/login')
    loginSignUp(@Body() body: { user_mobile_num: string}){
        return this.userService.loginSignUp(body);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':user_id_num')
    findOne(@Param('user_id_num', ParseIntPipe) userIdNum: number) {
        return this.userService.findOne(userIdNum);
    }
}
