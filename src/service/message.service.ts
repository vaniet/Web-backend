import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import type { Repository } from 'typeorm';
import { Message } from '../entity/message.entity';
import { Series } from '../entity/series.entity';
import { Style } from '../entity/style.entity';
import { CreateMessageDTO, UpdateMessageDTO } from '../dto/message.dto';

@Provide()
export class MessageService {
    @InjectEntityModel(Message)
    messageModel: Repository<Message>;

    @InjectEntityModel(Series)
    seriesModel: Repository<Series>;

    @InjectEntityModel(Style)
    styleModel: Repository<Style>;

    /**
     * 创建新消息
     */
    async createMessage(data: CreateMessageDTO): Promise<Message> {
        // 验证系列是否存在
        const series = await this.seriesModel.findOne({
            where: { id: data.seriesId }
        });
        if (!series) {
            throw new Error('系列不存在');
        }

        // 检查是否已存在该系列的消息
        const existingMessage = await this.messageModel.findOne({
            where: { seriesId: data.seriesId }
        });
        if (existingMessage) {
            throw new Error('该系列已存在消息记录');
        }

        // 获取系列包含的款式名称
        const styles = await this.styleModel.find({
            where: { seriesId: data.seriesId },
            select: ['name']
        });

        const styleNames = styles.map(style => style.name).join('');

        // 在原有内容基础上添加款式名称
        const contentWithStyles = styleNames ?
            `${data.content}${styleNames}` :
            data.content;

        const newMessage = this.messageModel.create({
            seriesId: data.seriesId,
            content: contentWithStyles,
        });
        return await this.messageModel.save(newMessage);
    }

    /**
     * 根据ID获取消息
     */
    async getMessageById(id: number): Promise<Message | null> {
        return await this.messageModel.findOne({
            where: { id },
            relations: ['series']
        });
    }

    /**
     * 根据系列ID获取消息
     */
    async getMessageBySeriesId(seriesId: number): Promise<Message | null> {
        return await this.messageModel.findOne({
            where: { seriesId },
            relations: ['series']
        });
    }

    /**
     * 获取所有消息
     */
    async getAllMessages(): Promise<Message[]> {
        return await this.messageModel.find({
            relations: ['series']
        });
    }

    /**
     * 更新消息内容
     */
    async updateMessage(id: number, data: UpdateMessageDTO): Promise<Message | null> {
        const message = await this.messageModel.findOne({
            where: { id }
        });
        if (!message) {
            return null;
        }

        message.content = data.content;
        return await this.messageModel.save(message);
    }

    /**
     * 根据ID删除消息
     */
    async deleteMessageById(id: number): Promise<boolean> {
        const message = await this.messageModel.findOne({
            where: { id }
        });
        if (!message) {
            return false;
        }

        await this.messageModel.delete({ id });
        return true;
    }

    /**
     * 根据系列ID删除消息
     */
    async deleteMessageBySeriesId(seriesId: number): Promise<boolean> {
        const message = await this.messageModel.findOne({
            where: { seriesId }
        });
        if (!message) {
            return false;
        }

        await this.messageModel.delete({ seriesId });
        return true;
    }
} 