/*
* �м���㡢���ڹ������λ�Ĺ�ϵ��ֻ��ע�ᵽ�м����������ܺ����������໥���á�
*
*
* */

WSUI.MiddleWare={
    list:{},//��ӽ�ȥ���б� ��ʽΪ{id:obj,id:obj}
    Reg:function(o,type){
        //���typeδ���� ���Զ��ʴ���
        if(!this.list[type])this.list[type]={};
        this.list[type][o.get('id')]=o;
    },
    Unreg:function(o,type){//���������type,���������type
        if(type){
            delete this.list[type][o.get('id')]
        }else{
            //��������type ��������
            jQuery.each(this.list,function(){
                delete this[o.get('id')]
            });
        }
    },
    //��������ӿڣ���������Ĵ���ͨ���˷�������
    Create:function(type,param){
        var _this=this;
        var newItem=WSUI.Create(WSUI[type],param);
        //����ִ������ǰ����Ҫִ�н����¼�
        jQuery(newItem).on('after_destroy',function(){
            _this.Unreg(newItem);
            jQuery(newItem).off();
            delete newItem;
        });
        switch(type){//��������ע�᲻ͬ������
            case 'Enemy_Light':
                _this.Reg(newItem,'enemy');
                break;
            case 'Tower':
                _this.Reg(newItem,'tower');
                break;
            case 'Bullet':
                _this.Reg(newItem,'bullet');
                //������ӵ�����Ҫ������ײENEMY
                WSUI.Skill['hit'].apply(newItem,[function(){return WSUI.MiddleWare.GetType('enemy')},{once:'T',auto_off:'T'}]);//�˴�����GETTYPE�ķ���
                newItem.onHit=function(tgt){
                    tgt.hurt(this.power);//�����е���������
                    this.destroy();
                };
                break;
        }
        //ע�ᵽGRID
        WSUI.Grid.Reg(newItem);
        return newItem;
    },
    //��list���ҳ� ֧����ϲ�ѯ �� a&&b a||b
    GetType:function(type){
        var arr=[];
        //�ж��Ƿ����&& ����
        if(/\w&&\w/.test(type)){
            var typeArray=type.split('&&');
            for (var i in typeArray){
                for ( var j in this.list[typeArray[i]]){
                    arr.push(this.list[typeArray[i]][j]);
                }
            }

        }else if(/\w\|\|\w/.test(type)){//�ж��Ƿ����|| ����

            var typeArray=type.split('||');
            var tplArr=[];


            for (var i in typeArray){//һ�δι���
                for(j in tempArr[typeArray[i]]){
                    tplArr.push(tempArr[typeArray[i]][j])
                }
            }
            console.log(tplArr);
        }else{
            for (var j in this.list[type]){
                arr.push(this.list[type][j]);
            }
        }

        return arr;

    }

}
//���Խ�������
var testObj={'��':['����','����','����'],'����':['����','����'],'60��':['����','����']};

var func=function(o,type){
    type=type.split('||');
    var getSameItem=function(objA,objB){//2������Ľ���
        var _result=[];
        for(var i in objA){
            if(jQuery.inArray(objA[i],objB)!=-1){ //-1˵����������B��
                _result.push(objA[i]);
            }
        }
        return _result;
    }
    var newArray=o[type[0]];//�õ�һ��������Ϊ��������
    for (var i =0; i <type.length-1;i++){//ѭ���͵�N+1�����бȽϣ�ȡ��������  ���N+1ΪUNDEFINED�����������������յĽ������
        newArray=getSameItem(newArray,o[type[i+1]]);
    }
    return newArray;
}

console.log(func(testObj,'��||����||60��'));