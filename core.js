/**
 * Created with JetBrains WebStorm.
 * User: minqi.zhumq
 * Date: 13-5-15
 * Time: 下午8:35
 * To change this template use File | Settings | File Templates.
 */

(function(window,undefined){
    window.WSUI=window.$UI={};
    WSUI.Classes={};
    WSUI.Singleton={};
    $UI.setup={};

    if(typeof jsContent=="undefined")jsContent={};
    jQuery.extend($UI.setup,jsContent);

    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    var Class = function(){};
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;
        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;
        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }
        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }
        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;
        return Class;
    };

    WSUI.Core= Class.extend({
        listener:{},//建议一个空的事件监听列表,
        linkProp:{},//建立一个属性关联（例如 人的is_nan_nv和动物的is_ci_xiong关系）

        init:function(_opt){
            var _this=this;
            if(!_opt)_opt={};
            if(_opt.listener)this.listener=_opt.listener;
            //每个对象都产生一个随机数作为id
            this.observers=[];//增加观察者
            this.set({
                'id':this.random(),
                'being':true    //新增being属性，用户判断对象是否已经执行过destory,执行过后修改为false,外部引用可以通过此参数来决定该对象是否已经销毁
            });


            //判断是否开启调试
            if(this.debug ){
                this.log=function(log,memo){//l内容，m说明
                    if(!memo)memo='';
                    //采用seajs的log替代console.log，避免IE出错
                    if(window.console)console.log(' %s 输出 %s: %o',this.name,memo,log);
                }
            }else{
                this.log=jQuery.noop;
            }
            //遍历listerner对象

            jQuery.each(this.listener,function(k,f){

                $(_this).on(k,jQuery.proxy(f,_this));
            })
        },
        random:function(length, upper, lower, number){
            if( !upper && !lower && !number ){
                upper = lower = number = true;
            }
            if(!length)length=20;
            var a = [
                ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
                ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
                ["0","1","2","3","4","5","6","7","8","9"]
            ];

            //临时数组
            var b = [];

            //临时字串
            var c = "";

            b = upper ? b.concat(a[0]) : b;
            b = lower ? b.concat(a[1]) : b;
            b = number ? b.concat(a[2]) : b;

            for (var i=0;i<length;i++){
                c += b[ Math.round(Math.random()*(b.length-1)) ];
            }

            return c;
        },
        _set:function(para,val){
            var _this=this;
            this[para]=val;
            //遍历observer表，如果此属性在观察者列表里，则进行匹配
            jQuery.each(this.observers,function(i){
                if((this['para']==para)&&(this['val']!=val)){//如果参数相等，值有变更，则执行observer函数
                    this['func'](val);//将变更后的值返回给函数，并执行
                    //更新observers
                    _this.observers[i]['val']=val;
                }
            })
        },
        set:function(para,val){//设置变量,需要实现BACKBONE的变更检测

            var _this=this;
            if((arguments.length==1)&&(typeof(para)=='object')){//只有一个对象
                jQuery.each(para,function(k,i){

                    if(_this.linkProp[k]){//检测属性关联里是否做过关联
                        _this._set(_this.linkProp[k],i);
                    }else{
                        _this._set(k,i);
                    }
                })
            }else{

                if(this.linkProp[para]){//检测属性关联里是否做过关联

                    this._set(this.linkProp[para],val);

                }else{
                    this._set(para,val);
                }
            }
            return this;
        },
        get:function(para){//获取变量
            if(this.linkProp[para]){//检测属性关联里是否做过关联
                return this[this.linkProp[para]];
            }else{
                return this[para];
            }
        },
        addObserver:function(para,func){//观察者，参考emberjs的观察者模式实现
            var _this=this;
            if(!para)this.missArg('缺少参数 para');
            var paraArr=para.split(',');
            for(i in paraArr){
                this.observers.push({
                    'para':paraArr[i],
                    'val':_this[para[i]],
                    'func':func
                });
            }

            return this;
        },
//        registerSingleton:function(){//标识单例
//            var root=WSUI.Singleton;
//            //目前先采用同级的方法
//            root[this.name]=this;
//        },
  //      unregisterSingleton:function(){//删除单例表示
//            var root=WSUI.Singleton;
//            //目前先采用同级的方法
//            root[this.name]=this;
    //    },
//        registerClasses:function(_cls,id){//绑定注册表
//            var root=WSUI.Classes;
//            //目前先采用同级的方法
//            if(!id){
//                root[_cls]=this;
//            }else{
//                if(!root[_cls])root[_cls]={};
//                root[_cls][id]=this;
//            }
//        },
//        unregisterClasses:function(_cls){//注销
//            delete WSUI.Classes[_cls];
//        },
        missArg:function(error){//必填提示
            console.error(error);
        },
        destroy:function(){
            //this.set('id',null);
            //WSUI.Class[this.get('id')]=null;
            this.set('being',false);
            //清理IE内存
            //if(jQuery.browser.msie)CollectGarbage();
        }
    });

    //运用此方法替代new 以实现单例
    WSUI.Create=function(_class,_opt){
        if(!_opt)_opt={};
        //if(WSUI.Singleton[_class.prototype.name]){//检测单例列表里是否有此类，如果有，直接返回
          //  return WSUI.Singleton[_class.prototype.name];
        //}else{
            return new _class(_opt);
        //}
    };
})(window);


