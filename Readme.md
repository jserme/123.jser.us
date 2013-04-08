# 123.jser.us
一个前端导航站, [123.jser.us](http://123.jser.us)

## 说明

    整合国内外的前端资源的网站， 面向中国前端工程师。

## 我要补充 

  __不要__ 直接编辑HTML文件, 编辑 _jade_ 文件.
    
  可以使用下面的任意一种方式来补充资源
  
  1. 推荐使用自带的交互脚本来添加
  	
  	 ```
 	 ./add.js
 	 ```
  

  1. 到[这里](https://github.com/jserme/123.jser.us/issues), 新建一个Issue, 格式如下
  
        
        网站名 : xxx
        140字内描述 ： xxx
        网址 ： xxx
        标签 ： xxx xxx

        标签请以逗号或者空格分隔， 参考目前已经有的类目

        

  1. 也可以在[微博](http://weibo.com/1826461472/)或者[草依山的博客](http://jser.me)联系作者修改, 当然也希望联系的时候按照上面的格式

  1. fork这个工程，然后修改data目录下的文件， 最后pull request一下。data目录下的文件格式如下:
  
        
        文件名就是网站名, 文件格式是不严格的JSON格式, 字段及描述：

        description: ： 140字的描述
        url: 网址
        tags: 标签 

        标签请以逗号或者空格分隔， 参考目前已经有的类目
        
   
        

## 编译 

```shell
  node build.js
```
