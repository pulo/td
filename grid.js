//����ϵͳ
WSUI.Grid={
    debug:'F',
    W:32,
    H:16,
    cw:30,// ������Ԫ��Ŀ��
    ch:30,// ������Ԫ��ĸ߶�
    cellArray:[],
    list:{},

    Reg:function(o){//������������
        var _this=this;
        this.list[o.get('id')]=o;
        //ע������壬���� �ƶ� ���� ���¼�
//        jQuery(o).on('after_move',function(){
//            //���¼�����ռ�ݵĸ���
//            _this.GridUsed(this);
//        });
        jQuery(o).on('after_destroy',function(){
            //����
            _this.Unreg(this);
        });
        //o.gridMap=[];
    },
    Unreg:function(o){
        delete this.list[o.get('id')];
    },
    PushItem:function(X,Y,o){//����ע�ᵽ����
        //ע�ᵽ��������壬���Ƚ���������
        this.cellArray[X][Y].push(o);


    },
    ItemLoc:function(x,y){ //���ݶ����xy���XY
        var X,Y;
        X=parseInt(x / this.cw);
        Y=parseInt(y / this.ch);
        return [X,Y];
    },
    GridUsed:function(o){//���ݶ���ĳ��� XY �����ռ�ĵ�Ԫ��
        var gridMap=[];
        var itemXY_1=this.ItemLoc(o.get('x'),o.get('y'));//�����Ͻ�XY
        var itemXY_2=this.ItemLoc(o.get('x')+o.get('w'),o.get('y')+o.get('h'));//�����½�XY
        if(itemXY_1[0]<0)itemXY_1[0]=0;
        if(itemXY_1[1]<0)itemXY_1[1]=0;

        if(itemXY_2[0]>(this.W-1))itemXY_2[0]=this.W-1;//�߽���
        if(itemXY_2[1]>(this.H-1))itemXY_2[1]=this.H-1;//�߽���

        for(var i=itemXY_1[0];i<=itemXY_2[0];i++){
            for(var j=itemXY_1[1];j<=itemXY_2[1];j++){
                gridMap.push([i,j]);
            }
        }
        //o.gridMap=gridMap;//Ϊ���� ����gridMap���ԣ���������ײ����
        return gridMap;
    },
    _init:function(){//��ʾ����
        var _this=this;
        for(var X=0;X<this.W;X++){ //����һ����λ���飬 ��¼���еĵ�Ԫ��ÿ����Ԫ��Ϊһ������������ڴ��ITEM ע:Ҫ���������󶪽�ȥ ��1��ID���������鷳
            this.cellArray[X]=[];
            for(var Y=0;Y<this.H;Y++){
                this.cellArray[X][Y]=[];
                if(this.debug=="T"){ //����ģʽ����HTML�ﻭ�����е�CELL
                    var id="g_"+X+"_"+Y;
                    var left=X*this.cw;
                    var top=Y*this.ch;
                    var width=this.cw;
                    var height=this.ch;
                    var dom=jQuery('<div>',{
                        'id':id,
                        'class':'grid_cell',
                        'style':'left:'+left+'px;top:'+top+'px;width:'+(width-1)+'px;height:'+(height-1)+'px;display:none'
                    });
                    $("#stage").append(dom);
                    //this.showCell(X,Y);
                    $("#g_"+X+"_"+Y).show();
                }
            }
        };
        //����һ��Timer

        //var RenderTimer=WSUI.Create(WSUI.Util.timer);


        //�˼�ʱ�����ڼ�����еı����Ķ������� �Ƿ��Ѿ��뿪���
        GameTimer.addEvent(function(){
            //����Ѿ��Ƴ����������
            $.each(_this.cellArray,function(i){
                $.each(this,function(j){
                    if(this.length>0)this.length=0;
                });
            });

            $.each(_this.list,function(){//����������б������������ ���� �������������� ע������
                var _i=this; //List���item
                var objLocMap=_this.GridUsed(this);//���������ռ��ȫ������
                $.each(objLocMap,function(){ //��������ռ�������� �Ѷ���ӽ�ȥ
                    _this.PushItem(this[0],this[1],_i);
                })
            });
        });

        if(this.debug=="T"){ //������ģʽ ������ʾ����cell�������е�ITEMID
            this.bakHtmlTxt={};//����CELL�ĵ�Ԫ��HTML �����ظ���Ⱦ
            GameTimer.addEvent(function(){//��ʱ ֱ�Ӹ���cellArray
                $.each(_this.cellArray,function(i){
                    $.each(this,function(j){
                        if(this.toString()!=_this.bakHtmlTxt["#g_"+i+"_"+j]){
                            var itemList="";
                            $.each(this,function(){
                                itemList+=this.id.substr(0,5)+"<br />";
                            });
                            $("#g_"+i+"_"+j).html(itemList);
                        }
                        _this.bakHtmlTxt["#g_"+i+"_"+j]=this.toString();//����CELL�ĵ�Ԫ��HTML �����ظ���Ⱦ
                    });
                });
            })
        }
    }

}

$(document).ready(function(){WSUI.Grid._init();})