import { Controller, Post, Files, Fields } from '@midwayjs/core';
import { join } from 'path';
import { existsSync, mkdirSync, copyFileSync, unlinkSync } from 'fs';

function sanitizeName(name: string) {
    // 只保留中英文、数字，其他替换为下划线
    return name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '_');
}

@Controller('/upload')
export class UploadController {
    @Post('/')
    async upload(@Files() files, @Fields() fields) {
        const { type, name } = fields || {}; // type: 'series' | 'styles', name: 系列或款式名
        if (!files || files.length === 0) {
            return { error: 'No file uploaded' };
        }
        if (!type || !name) {
            return { error: 'Missing type or name' };
        }
        // 支持 avatar 和 player-show 类型
        const folder =
            type === 'series'
                ? 'series'
                : type === 'styles'
                    ? 'styles'
                    : type === 'avatar'
                        ? 'avatar'
                        : type === 'player-show'
                            ? 'player-show'
                            : 'other';
        const uploadDir = join(process.cwd(), 'public', folder);
        if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
        const ext = files[0].filename.substring(files[0].filename.lastIndexOf('.'));
        const safeName = sanitizeName(name || 'unknown');
        let filename = `${safeName}${ext}`;
        let targetPath = join(uploadDir, filename);
        let i = 1;
        while (existsSync(targetPath)) {
            filename = `${safeName}_${Date.now()}_${i}${ext}`;
            targetPath = join(uploadDir, filename);
            i++;
        }
        copyFileSync(files[0].data, targetPath);
        unlinkSync(files[0].data);
        return { url: `${folder}/${filename}` };
    }
}
