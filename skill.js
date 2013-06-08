/*
* ���ܿ�
* */
//WSUI.Skill=(function(){
//
//})();
WSUI.Skill={
    move:function(){
        var _this=this;
        //d:�ƶ�����
        //s:�ƶ���λ

        this.move=function(){
            $(_this).trigger('before_move');
            var moveOffset=WSUI.Util.Geometry.GetOffset(_this._temp_d,_this.spd);
            _this.set('x',_this.get('x')+moveOffset[0]);
            _this.set('y',_this.get('y')+moveOffset[1]);
            $(_this).trigger('after_move');
        };

        this.startMove=function(d){
            if(_this._ismove){
                _this._temp_d=d;
                return false;
            }else{
                _this._ismove=true;
            }
            if(!d)d=0;
            _this._temp_d=d;
            GameTimer.addEvent(_this.move);
        //_temp_d ��ʹ�ú���������

        };
        this.stopMove=function(){
            GameTimer.removeEvent(_this.move);
            _this._ismove=false;
            delete _this._temp_d;
        };

        //����destroy�������������Ҫִ��ֹͣ
        $(this).on('before_destroy',function(){
            _this.stopMove();
        })

    },

    //��hit
    //����һ�������Ҫ���������壻������������
    /*
     * once��ÿ�μ��ʱ���緢����ײ��ֻ��һ������ײ�������¼���Ĭ��Ϊ'T' or 'F'
     * auto_off һ��������ײ ���رպ�����ײ��� Ĭ��'F'
     * */
    hit:function(testList,cfg){
        if(!cfg)cfg={};
        if(!cfg.once)cfg.once='T';
        if(!cfg.auto_off)cfg.auto_off='F';

        var _this=this;
        this.checkList=[];
        this.hitBind=function(objList){//�������б� ������ʽ
            _this.checkList=objList;
        };
        this.onHit=jQuery.noop;//�������ʼ����ײ�¼�
        this.hit=function(){
            $(_this).trigger('before_hit_test');//��ʼ��ײ���
            //����ײ�󶨵ĺ�������ÿ�β���ʱ���У�ʵʱ������ײ���Ķ���
            _this.hitBind(testList());
            //xy��ײ���
            for(i in _this.checkList){
                if(WSUI.Util.Position.HitTest(_this,_this.checkList[i])){//������ײ
                    _this.onHit(_this.checkList[i]);//ִ����ײ�¼������ѱ���ײ���󷵻ػ�ȥ

                    if(cfg.auto_off=='T')_this.hitOff();//���onceΪT ���˳�ѭ��
                    if(cfg.once=='T')return false;//���onceΪT ���˳�ѭ��
                }
            }
            $(_this).trigger('after_hit_test');//������ײ���
        };



        //�Զ���ʼ��ײ����
        GameTimer.addEvent(_this.hit);
        this.hitOff=function(){
        //�ر���ײ����
            GameTimer.removeEvent(_this.hit);
        };
        //����destroy�������������Ҫִ��ֹͣ
        $(this).on('before_destroy',function(){
            _this.hitOff();
        })
    },
    //���
    shot:function(type){//�������
        var _this=this;
        this.shot=function(d){
            WSUI.MiddleWare.Create('Bullet',{x:_this.get('x'),y:_this.get('y'),direction:d});
        }
    }
}