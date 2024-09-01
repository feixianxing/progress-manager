# Progress-Manager

[切换到中文](./README.zh-CN.md)

This is an application that can help you to manage progress.   
Features: 
* manage progress, 
* manage progress-step-node, 
* import and export by JSON file.


> pending features: search, statistics, sort...  

## Data Storage
The Data of this application is stored in the local storage of the browser.
And the data can be import or export by JSON file.

> So far, the JSON file that was imported must be a JSON file that was exported by this application.  
> Or it will cause an error, because the data structure is different and cannot be parsed.

## Responsive Design
Currently, I have only done some simple adaptation work on the mobile terminal. So I suggest you to use it on PC.

## environment
* node v18.17.0
* pnpm 8.14.1

## how to run
* 开发模式：
```
npm run dev
```
* 打包项目
```
npm run build
```