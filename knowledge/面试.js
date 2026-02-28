// 如何获取对象的symbol keys, getOwnPropertySymbols
// forin 会返回所有可枚举key包括原型链上的，不包括symbol；object.keys不会返回原型链上的keys；getOwnPropertyNames返回所有可枚举不可枚举的keys，但也不会返回symbol

/**
 * webpack生命周期/钩子
 * https://blog.csdn.net/qq_17335549/article/details/137561075
 * 初始化阶段 -> 编译阶段:before-run -> 构建阶段:compilation -> 优化阶段:optimize/processAssets -> 产出阶段:emit -> 完成阶段:completion
 * WebpackManifestPlugin在processAssets钩子执行
 * ImageMinimizerPlugin在processAssets阶段执行
 */
// webpack常见的plugin https://blog.csdn.net/qq_17335549/article/details/135854098

// ReactNative 0.63解决安卓16kb问题 - native配置启用hermes引擎
