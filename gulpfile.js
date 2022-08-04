/**
 * ------------------------------------------------------------------
 * gulpfile 文件
 * ------------------------------------------------------------------
 *
 */

const { series, task, src, dest } = require('gulp')
const GulpSSH = require('gulp-ssh')
const del = require('del')
// 路径配置
let paths = {
    src: {
        baseDir: 'src/**'
    },
    dist: {
        baseDir: 'dist/**'
    },
    release: {
        baseDir: '../dictionary.h5.release'
    },
    deploy: {
        baseDir: '/roobo/webserver/website/wx-fe',
        testDir: '/roobo/webserver/website/wx-test'
    }
}
// ssh 服务配置
let feConfig = {
    host: '172.17.254.121',
    port: 22,
    username: 'root',
    password: 'juan3652014'
}
let feSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: feConfig
})

let testConfig = {
    host: '172.17.243.39',
    port: 22,
    username: 'root',
    password: 'Roobo2017test'
}
let testSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: testConfig
})

// fe server 部署
function deployFe() {
    return src(paths.dist.baseDir).pipe(feSSH.dest(paths.deploy.baseDir))
}

// test server 部署
function deployTest() {
    return src(paths.dist.baseDir).pipe(testSSH.dest(paths.deploy.testDir))
}

// copy dist 目录
function copyDist() {
    let srcFile = [paths.dist.baseDir, '.gitignore']
    return src(srcFile).pipe(dest(paths.release.baseDir))
}

// clean dist 目录
function cleanDist() {
    return del(paths.dist.baseDir)
}

// 代码编译
function build(cb) {
    // body omitted
    console.log('****** 代码编译 ******')
    cb()
}

task(deployFe)
task(deployTest)
task(cleanDist)
task(copyDist)

exports.build = build
exports.default = series(cleanDist, build)
