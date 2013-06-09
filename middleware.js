/*
* 中间件层、用于管理各单位的关系，只有注册到中间件的物体才能和其他物体相互作用。
*
*
* */

WSUI.MiddleWare={
    list:{},//添加进去的列表 形式为{id:obj,id:obj}
    Reg:function(o,type){
        if(!type)console.error('MiddleWare注册组不能为空')
        //如果type未定义 则自动鲜创建
        if(!this.list[type])this.list[type]={};
        this.list[type][o.get('id')]=o;
    },
    Unreg:function(o,type){//如果不设置type,则清除所有type
        if(type){
            delete this.list[type][o.get('id')]
        }else{
            //遍历所有type 进行清理
            jQuery.each(this.list,function(){
                delete this[o.get('id')]
            });
        }
    },
    //创建物体接口，所有物体的创建通过此方法创建
    Create:function(type,param){
        var _this=this;
        var newItem=WSUI.Create(WSUI[type],param);
        //对象执行销毁前，先要执行解绑等事件
        jQuery(newItem).on('before_destroy',function(){
            _this.Unreg(newItem);
            jQuery(newItem).off();
            delete newItem;
        });

        switch(type){//根据类型注册不同的类型
            case 'Enemy_Light':
                _this.Reg(newItem,'enemy');
                //让怪物绑定路径，并且开始走动

                WSUI.Skill['moveInPath'].apply(newItem,[WSUI.Path]);
                newItem.startMoveInPath();
                break;
            case 'Tower_Gun':
                _this.Reg(newItem,'tower');

                break;
            case 'Bullet':
                _this.Reg(newItem,'bullet');

                //如果是子弹，需要监视碰撞ENEMY
                WSUI.Skill['hit'].apply(newItem,[function(){
                    //返回的碰撞检测条件1、类型是ENEMY 2、所在单元格和自身单元格有交集
                    //1、检测自身单元格的怪
                    var testList=[];
                    var myUseGrid=WSUI.Grid.GridUsed(newItem);

                    for (var i in myUseGrid){
                        //todo 尝试改成apply写法
                        var _item=WSUI.Grid.HaveObj(myUseGrid[i][0],myUseGrid[i][1]);
                        for(var j in _item){
                            testList.push(_item[j]);//分别加入到list里
                        }
                    }

                    var typeTgt=WSUI.MiddleWare.GetType('enemy');

                    var testObjs=$UI.Util.Object.Intersect(testList,typeTgt);

                    //console.log(testObjs);
                    return testObjs;
                    //return WSUI.MiddleWare.GetType('enemy');
                },{once:'T',auto_off:'T'}]);//此处返回GETTYPE的方法
                newItem.onHit=function(tgt){
                    tgt.hurt(this.power);//被击中的物体受伤
                    this.destroy();
                };
                break;
        }
        //注册到GRID
        WSUI.Grid.Reg(newItem);
        return newItem;
    },
    //从list中找出 支持组合查询 如 a&&b a||b
    GetType:function(type){
        var arr=[];
        //判断是否包含&& 并集
        if(/\w&&\w/.test(type)){
            var typeArray=type.split('&&');
            //jQuery的merge只支持2个合并 不支持多个,所以自己写一个
            for (var i in typeArray){
                for ( var j in this.list[typeArray[i]]){
                    arr.push(this.list[typeArray[i]][j]);
                }
            }

        }else if(/\w\|\|\w/.test(type)){//判断是否包含|| 交集

            var typeArray=type.split('||');
            var param=[];
            for (i in typeArray){
                param.push(this.list[typeArray[i]]);
            }
            arr=$UI.Util.Object.Intersect.apply(null,param);
        }else{
            for (var j in this.list[type]){
                arr.push(this.list[type][j]);
            }
        }

        return arr;

    }

}
////测试交集函数
//var testObj={'男':['张三','李四','王五'],'工人':['张三','李四'],'60岁':['李四','王五','王五'],'有娃':['李四']};
//
//var func=function(o,type){
//    type=type.split('||');
//    var getSameItem=function(objA,objB){//2个对象的交集
//        var _result=[];
//        for(var i in objA){
//            if(jQuery.inArray(objA[i],objB)!=-1){ //-1说明不在数组B内
//                _result.push(objA[i]);
//            }
//        }
//        return _result;
//    }
//    var newArray=o[type[0]];//拿第一个数组作为基础数组
//    for (var i =0; i <type.length-1;i++){//循环和第N+1个进行比较，取出公共集  如果N+1为UNDEFINED，则跳出，并把最终的结果返回
//        newArray=getSameItem(newArray,o[type[i+1]]);
//    }
//    return newArray;
//}
//
////console.log(func(testObj,'男||工人||60岁'));

//console.log($UI.Util.Object.Intersect(testObj['男'],testObj['工人'],testObj['60岁']))
//
//var a=function(){
//    console.log(arguments.length);
//}
//
//var arr=[1,2,3,4,5];
////a(_____);//如何起到和a(1,2,3,4,5)一样的效果
//a.apply(null,arr);

