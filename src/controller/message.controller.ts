import { Controller, Post, Body, Del, Param, Get, Put } from '@midwayjs/core';
import { Inject } from '@midwayjs/core';
import { MessageService } from '../service/message.service';
import { CreateMessageDTO, UpdateMessageDTO } from '../dto/message.dto';
import { ResponseResult } from '../common/response.common';

@Controller('/message')
export class MessageController {
    @Inject()
    messageService: MessageService;

    /**
     * 创建新消息
     */
    @Post('/create')
    async create(@Body() dto: CreateMessageDTO) {
        try {
            const message = await this.messageService.createMessage(dto);
            return ResponseResult.success(message, '消息创建成功');
        } catch (error) {
            return ResponseResult.error(error.message, 400);
        }
    }

    /**
     * 根据ID获取消息
     */
    @Get('/:id')
    async getMessageById(@Param('id') id: number) {
        const message = await this.messageService.getMessageById(Number(id));
        if (!message) {
            return ResponseResult.error('消息不存在', 404);
        }
        return ResponseResult.success(message);
    }

    /**
     * 根据系列ID获取消息
     */
    @Get('/series/:seriesId')
    async getMessageBySeriesId(@Param('seriesId') seriesId: number) {
        const message = await this.messageService.getMessageBySeriesId(Number(seriesId));
        if (!message) {
            return ResponseResult.error('该系列暂无消息记录', 404);
        }
        return ResponseResult.success(message);
    }

    /**
     * 获取所有消息
     */
    @Get('/all')
    async getAllMessages() {
        const messages = await this.messageService.getAllMessages();
        return ResponseResult.success(messages);
    }

    /**
     * 更新消息内容
     */
    @Put('/:id')
    async updateMessage(@Param('id') id: number, @Body() dto: UpdateMessageDTO) {
        const message = await this.messageService.updateMessage(Number(id), dto);
        if (!message) {
            return ResponseResult.error('消息不存在', 404);
        }
        return ResponseResult.success(message, '消息更新成功');
    }

    /**
     * 根据ID删除消息
     */
    @Del('/:id')
    async deleteMessageById(@Param('id') id: number) {
        const result = await this.messageService.deleteMessageById(Number(id));
        if (!result) {
            return ResponseResult.error('消息不存在', 404);
        }
        return ResponseResult.success(null, '消息删除成功');
    }

    /**
     * 根据系列ID删除消息
     */
    @Del('/series/:seriesId')
    async deleteMessageBySeriesId(@Param('seriesId') seriesId: number) {
        const result = await this.messageService.deleteMessageBySeriesId(Number(seriesId));
        if (!result) {
            return ResponseResult.error('该系列暂无消息记录', 404);
        }
        return ResponseResult.success(null, '消息删除成功');
    }
} 