const fs = require('fs');
const path = require('path');

/**
 * 清理日志文件脚本
 * 删除超过指定天数的日志文件
 */

const LOG_DIR = path.join(__dirname, '../logs');
const MAX_DAYS = 7; // 保留最近7天的日志

function cleanLogs() {
    console.log('开始清理日志文件...');

    if (!fs.existsSync(LOG_DIR)) {
        console.log('日志目录不存在，跳过清理');
        return;
    }

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (MAX_DAYS * 24 * 60 * 60 * 1000));

    let deletedCount = 0;
    let totalSize = 0;

    function processDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                processDirectory(itemPath);
            } else if (stat.isFile() && item.endsWith('.log')) {
                // 检查文件修改时间
                if (stat.mtime < cutoffDate) {
                    try {
                        fs.unlinkSync(itemPath);
                        deletedCount++;
                        totalSize += stat.size;
                        console.log(`已删除: ${itemPath}`);
                    } catch (error) {
                        console.error(`删除文件失败: ${itemPath}`, error.message);
                    }
                }
            }
        }
    }

    processDirectory(LOG_DIR);

    console.log(`清理完成！`);
    console.log(`删除文件数: ${deletedCount}`);
    console.log(`释放空间: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

// 如果直接运行此脚本
if (require.main === module) {
    cleanLogs();
}

module.exports = { cleanLogs }; 