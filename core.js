/**
 * Created with JetBrains WebStorm.
 * User: minqi.zhumq
 * Date: 13-5-15
 * Time: ����8:35
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
        listener:{},//����һ���յ��¼������б�,
        linkProp:{},//����һ�����Թ��������� �˵�is_nan_nv�Ͷ����is_ci_xiong��ϵ��

        init:function(_opt){
            var _this=this;
            if(!_opt)_opt={};
            if(_opt.listener)this.listener=_opt.listener;
            //ÿ�����󶼲���һ���������Ϊid
            this.observers=[];//���ӹ۲���
            this.set({
                'id':this.random(),
                'being':true    //����being���ԣ��û��ж϶����Ƿ��Ѿ�ִ�й�destory,ִ�й����޸�Ϊfalse,�ⲿ���ÿ���ͨ���˲����������ö����Ƿ��Ѿ�����
            });


            //�ж��Ƿ�������
            if(this.debug ){
                this.log=function(log,memo){//l���ݣ�m˵��
                    if(!memo)memo='';
                    //����seajs��log���console.log������IE����
                    if(window.console)console.log(' %s ��� %s: %o',this.name,memo,log);
                }
            }else{
                this.log=jQuery.noop;
            }
            //����listerner����

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

            //��ʱ����
            var b = [];

            //��ʱ�ִ�
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
            //����observer������������ڹ۲����б�������ƥ��
            jQuery.each(this.observers,function(i){
                if((this['para']==para)&&(this['val']!=val)){//���������ȣ�ֵ�б������ִ��observer����
                    this['func'](val);//��������ֵ���ظ���������ִ��
                    //����observers
                    _this.observers[i]['val']=val;
                }
            })
        },
        set:function(para,val){//���ñ���,��Ҫʵ��BACKBONE�ı�����

            var _this=this;
            if((arguments.length==1)&&(typeof(para)=='object')){//ֻ��һ������
                jQuery.each(para,function(k,i){

                    if(_this.linkProp[k]){//������Թ������Ƿ���������
                        _this._set(_this.linkProp[k],i);
                    }else{
                        _this._set(k,i);
                    }
                })
            }else{

                if(this.linkProp[para]){//������Թ������Ƿ���������

                    this._set(this.linkProp[para],val);

                }else{
                    this._set(para,val);
                }
            }
            return this;
        },
        get:function(para){//��ȡ����
            if(this.linkProp[para]){//������Թ������Ƿ���������
                return this[this.linkProp[para]];
            }else{
                return this[para];
            }
        },
        addObserver:function(para,func){//�۲��ߣ��ο�emberjs�Ĺ۲���ģʽʵ��
            var _this=this;
            if(!para)this.missArg('ȱ�ٲ��� para');
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
//        registerSingleton:function(){//��ʶ����
//            var root=WSUI.Singleton;
//            //Ŀǰ�Ȳ���ͬ���ķ���
//            root[this.name]=this;
//        },
  //      unregisterSingleton:function(){//ɾ��������ʾ
//            var root=WSUI.Singleton;
//            //Ŀǰ�Ȳ���ͬ���ķ���
//            root[this.name]=this;
    //    },
//        registerClasses:function(_cls,id){//��ע���
//            var root=WSUI.Classes;
//            //Ŀǰ�Ȳ���ͬ���ķ���
//            if(!id){
//                root[_cls]=this;
//            }else{
//                if(!root[_cls])root[_cls]={};
//                root[_cls][id]=this;
//            }
//        },
//        unregisterClasses:function(_cls){//ע��
//            delete WSUI.Classes[_cls];
//        },
        missArg:function(error){//������ʾ
            console.error(error);
        },
        destroy:function(){
            //this.set('id',null);
            //WSUI.Class[this.get('id')]=null;
            this.set('being',false);
            //����IE�ڴ�
            //if(jQuery.browser.msie)CollectGarbage();
        }
    });

    //���ô˷������new ��ʵ�ֵ���
    WSUI.Create=function(_class,_opt){
        if(!_opt)_opt={};
        //if(WSUI.Singleton[_class.prototype.name]){//��ⵥ���б����Ƿ��д��࣬����У�ֱ�ӷ���
          //  return WSUI.Singleton[_class.prototype.name];
        //}else{
            return new _class(_opt);
        //}
    };
})(window);


