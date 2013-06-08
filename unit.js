/*
* ��Ÿ��ֵз���ɫ
* */

/*
*
*
* ��Ԫ���ࣺӵ������ XY,WH����һЩ��������
* */
WSUI.Unit=WSUI.Core.extend({
    init:function(_opt){
        var _this=this;
        if(!_opt)_opt={};
        this._super(_opt);
        this.set({
            'x':_opt.x||0,
            'y':_opt.y||0,
            'w':_opt.w||this.missArg('miss argument w(width)'),
            'h':_opt.h||this.missArg('miss argument h(height)')
        });

        //����һ��dom
        this.dom=jQuery("<div>",{
            'id':this.id,
            'class':'unit',
            'style':'width:'+this.get('w')+'px;height:'+this.get('h')+'px;-webkit-transform: translate('+this.get('x')+'px,'+this.get('y')+'px)'
        });
        $('#stage').append(this.dom);
        //��Timer��ȫ�ֱ���������ʵʱ�������Ե��¼�
        this.renderEvent=function(){
            _this.dom.css('transform','translate('+_this.get('x')+'px,'+_this.get('y')+'px)')
//            _this.dom.css('left',_this.get('x'));
//            _this.dom.css('top',_this.get('y'));
        };
        RenderTimer.addEvent(this.renderEvent);
    },
    destroy:function(){
        jQuery(this).trigger("before_destroy");
        this.dom.remove();
        RenderTimer.removeEvent(this.renderEvent);
        this._super();
        jQuery(this).trigger("after_destroy");
    }
});

WSUI.Enemy=WSUI.Unit.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        this._super(_opt);
        var _this=this;
        this.set({
            hp:100,
            maxHp:100,
            spd:5//Ĭ���ƶ��ٶ�
        });
        this.addObserver('hp,maxHp',function(v){
            _this.dom_life.children('div').css('width',v/_this.get('maxHp')*100+'%');
        });
        this.dom.addClass('enemy');
        //Ϊdom����Ѫ��
        this.dom_life=jQuery("<div>",{
            'class':'life',
            'style':'width:'+this.get('w')+'px;height:5px;background-color:#f99'
        });
        this.dom_life.append(jQuery('<div>',{
            'style':'width:100%;background-color:#cfd7ff;height:5px'
        }));
        this.dom_life.appendTo(this.dom);

        //��skill-move
        WSUI.Skill['move'].apply(this);

        //��ӵ�middleware
        //WSUI.MiddleWare.list.enemy[this.get('id')]=this;
        //WSUI.MiddleWare.reg(this,'enemy');
    },

    hurt:function(_lostHp){//�����¼� lostHp:���յ��˺���ֵ(�۳�Ѫ��)
        this.set('hp',this.get('hp')-_lostHp);
        if(this.get('hp')<=0)this.die();
    },
    die:function(){//����
        //��������
        this.destroy();
    }
});

//С�͹���
WSUI.Enemy_Light=WSUI.Enemy.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        if(!_opt.w)_opt.w=24;
        if(!_opt.h)_opt.h=24;
        this._super(_opt);
        this.set({
            w:_opt.w,
            h:_opt.h,
            hp:200,
            maxHp:200,
            spd:2
        });
        this.dom.addClass('enemy_light');
    }
});

//��
WSUI.Tower=WSUI.Unit.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        if(!_opt.w)_opt.w=24;
        if(!_opt.h)_opt.h=24;
        var _this=this;
        this._super(_opt);
        this.set({
            'w':_opt.w,
            'h':_opt.h
        });
        WSUI.Skill['shot'].apply(this);//���������
        var _l=0;
        setInterval(function(){
            _l++;
            if(_l>25)_i=0;
            for(var i=0;i<2;i++){
                _this.shot(i*8*Math.random()+90+_l*14.4);
            }
        },180);
        _this.shot(140);
    }
});

//�ӵ�
WSUI.Bullet=WSUI.Unit.extend({
    init:function(_opt){
        if(!_opt)_opt={};
        if(!_opt.w)_opt.w=8;
        if(!_opt.h)_opt.h=8;
        var _this=this;
        this._super(_opt);
        this.set({
            'w':_opt.w,
            'h':_opt.h,
            'spd':10,//Ĭ���ƶ��ٶ�
            'power':30//����
        });
        //this.dom.addClass('bullet');
        //��skill-move
        WSUI.Skill['move'].apply(this);
        this.startMove(_opt.direction);
        //��skill-hit
        //��ӵ�middleware
        //WSUI.MiddleWare.reg(this,'bullet');

        //�ӵ��������¼�
        this.lifeTimer=setTimeout(function(){
            _this.destroy();
        },2500)
    },
    destroy:function(){

        clearTimeout(this.lifeTimer);
        this._super();
    }
});
