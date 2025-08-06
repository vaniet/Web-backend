const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 测试相关的包及其推荐版本
const testPackages = {
      // Jest 生态
  'jest': '^30.0.0',
  '@types/jest': '^30.0.0',
  'ts-jest': '^29.4.0',

    // HTTP 测试
    'supertest': '^7.1.3',
    '@types/supertest': '^2.0.16',

    // MidwayJS 测试工具
    '@midwayjs/mock': '^3.20.11',

    // 类型定义
    '@types/node': '^18.0.0',

    // 其他测试工具
    'cross-env': '^7.0.3'
};

function checkPackageVersions() {
    console.log('🔍 检查测试包版本兼容性...\n');

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    console.log('当前版本 vs 推荐版本:');
    console.log('='.repeat(50));

    let hasIssues = false;

    Object.entries(testPackages).forEach(([pkg, recommendedVersion]) => {
        const currentVersion = allDeps[pkg];

        if (currentVersion) {
            console.log(`${pkg}:`);
            console.log(`  当前: ${currentVersion}`);
            console.log(`  推荐: ${recommendedVersion}`);

            // 简单的版本比较（这里可以更复杂）
            if (currentVersion !== recommendedVersion) {
                console.log(`  ⚠️  建议更新`);
                hasIssues = true;
            } else {
                console.log(`  ✅ 版本兼容`);
            }
        } else {
            console.log(`${pkg}: ❌ 未安装`);
            hasIssues = true;
        }
        console.log('');
    });

    if (hasIssues) {
        console.log('💡 建议运行以下命令更新测试依赖:');
        console.log('npm update jest @types/jest ts-jest supertest @types/supertest @midwayjs/mock');
    } else {
        console.log('🎉 所有测试包版本都是兼容的！');
    }
}

// 检查是否有过时的包
function checkOutdatedPackages() {
    try {
        console.log('\n📦 检查过时的包...');
        const result = execSync('npm outdated --json', { encoding: 'utf8' });
        const outdated = JSON.parse(result);

        const testRelatedOutdated = Object.keys(outdated).filter(pkg =>
            Object.keys(testPackages).includes(pkg)
        );

        if (testRelatedOutdated.length > 0) {
            console.log('发现过时的测试相关包:');
            testRelatedOutdated.forEach(pkg => {
                const info = outdated[pkg];
                console.log(`  ${pkg}: ${info.current} → ${info.latest}`);
            });
        } else {
            console.log('✅ 所有测试相关包都是最新的');
        }
    } catch (error) {
        console.log('✅ 没有过时的包');
    }
}

// 主函数
function main() {
    checkPackageVersions();
    checkOutdatedPackages();
}

if (require.main === module) {
    main();
}

module.exports = { checkPackageVersions, checkOutdatedPackages }; 