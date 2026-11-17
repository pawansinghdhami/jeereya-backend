import { 
Controller,
Get,
Post,
Body,
Param,
ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    
    constructor(
        private readonly userService: UsersService,
    ){}

    @Post()
    create(@Body() body: { user_name: string, user_email: string}) {
        return this.userService.create(body);
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
