/**
 * @author wWX233311
 *
 */
var globleObjManager = {};
var locObj = {
		minxele : null,
		minyele : null,
		maxxele : null,
		maxyele : null	
	};
var MAXX = screen.availWidth - 140;
var MAXY = screen.availHeight - 70;
var MINX = 2;
var MINY = 28;
var WIDTH = screen.availWidth - 140 - 2;
var HEIGHT = screen.availHeight - 70 - 28;
var bounds = { x: 2, y: 28, width: WIDTH, height: HEIGHT };
var proflag = false;
//是否是分布式电站
var distribute = false;
function fixNodeLocation (node) {
	  var textSize = _twaver.g.getTextSize(node.getStyle('label.font'), node.getName());
	  var nodeBounds = node.getRect();
	  var position = _twaver.position.get(node.getStyle('label.position'), nodeBounds, textSize);
	  var labelx = node.getStyle("label.xoffset");
	  var labely = node.getStyle("label.yoffset");
	  var unionBounds = _twaver.math.unionRect(nodeBounds, { x: position.x + labelx, y: position.y + labely, width: textSize.width, height: textSize.height });
	  var offsetX = nodeBounds.x - unionBounds.x;
	  var offsetY = nodeBounds.y - unionBounds.y;
	  if (unionBounds.x < bounds.x
	      || unionBounds.y < bounds.y
	      || unionBounds.x + unionBounds.width > bounds.x + bounds.width
	      || unionBounds.y + unionBounds.height > bounds.y + bounds.height) {
		  	proflag = true;
		    node._isUpdatingLocation != null && (node._isUpdatingLocation = false);
		    var x = unionBounds.x < bounds.x ? bounds.x : unionBounds.x;
		    x = unionBounds.x + unionBounds.width > bounds.x + bounds.width ? bounds.x + bounds.width - unionBounds.width : x;
		    var y = unionBounds.y < bounds.y ? bounds.y : unionBounds.y;
		    y = unionBounds.y + unionBounds.height > bounds.y + bounds.height ? bounds.y + bounds.height - unionBounds.height : y;
		    node.setLocation(x + offsetX, y + offsetY);
		    proflag = false;
	  }
}

function fixNodeLocation2 (node) {
	  var textSize = _twaver.g.getTextSize(node.getStyle('label.font'), node.getName());
	  var nodeBounds = node.getRect();
	  var position = _twaver.position.get(node.getStyle('label.position'), nodeBounds, textSize);
	  var labelx = node.getStyle("label.xoffset");
	  var labely = node.getStyle("label.yoffset");
	  var unionBounds = _twaver.math.unionRect(nodeBounds, { x: position.x + labelx, y: position.y + labely, width: textSize.width, height: textSize.height });
	  var offsetX = nodeBounds.x - unionBounds.x;
	  var offsetY = nodeBounds.y - unionBounds.y;
	  if (unionBounds.x < bounds.x
	      || unionBounds.y < bounds.y
	      || unionBounds.x + unionBounds.width > bounds.x + bounds.width
	      || unionBounds.y + unionBounds.height > bounds.y + bounds.height) {
		  	proflag = true;
		    node._isUpdatingLocation != null && (node._isUpdatingLocation = false);
		    var x = unionBounds.x < bounds.x ? bounds.x : unionBounds.x;
		    x = unionBounds.x + unionBounds.width > bounds.x + bounds.width ? bounds.x + bounds.width - unionBounds.width : x;
		    var y = unionBounds.y < bounds.y ? bounds.y : unionBounds.y;
		    y = unionBounds.y + unionBounds.height > bounds.y + bounds.height ? bounds.y + bounds.height - unionBounds.height : y;
		    node.setLocation(x + offsetX, y + offsetY);
	  }
}

function getEleMarginValue(networktmp,ele,str){
	var elexmin = ele.getLocation().x;
	var elexmax = ele.getLocation().x + ele.getWidth();
	var eleymin = ele.getLocation().y;
	var eleymax = ele.getLocation().y + ele.getHeight();
    var labelrect = "";
	var labelxmin = "";
	var labelxmax = "";
	var labelymin = "";
	var labelymax = "";
	var textSize = _twaver.g.getTextSize(ele.getStyle('label.font'), ele.getName());
	var nodeBounds = ele.getRect();
	var position = _twaver.position.get(ele.getStyle('label.position'), nodeBounds, textSize);
	var labelx = ele.getStyle("label.xoffset");
	var labely = ele.getStyle("label.yoffset");
	var unionBounds = _twaver.math.unionRect(nodeBounds, { x: position.x + labelx, y: position.y + labely, width: textSize.width, height: textSize.height });
	labelxmin = position.x + labelx;
	labelxmax = position.x + labelx + textSize.width;
	labelymin = position.y + labely;
	labelymax = position.y + labely + textSize.height;
	switch(str){
		case "minx" : return (elexmin > labelxmin) ? labelxmin : elexmin;
		case "miny" : return (eleymin > labelymin) ? labelymin : eleymin;
		case "maxx" : return (elexmax > labelxmax) ? elexmax : labelxmax;
		case "maxy" : return (eleymax > labelymax) ? eleymax : labelymax;
	}
}

/*function getUnionBounds (node) {
    var textSize = _twaver.g.getTextSize(node.getStyle('label.font'), node.getName());
    var nodeBounds = node.getRect();
    var position = _twaver.position.get(node.getStyle('label.position'), nodeBounds, textSize);
    return _twaver.math.unionRect(nodeBounds, { x: position.x, y: position.y, width: textSize.width, height: textSize.height });
}*/

function getUnionBounds (node) {
    var textSize = _twaver.g.getTextSize(node.getStyle('label.font'), node.getName());
    var nodeBounds = node.getRect();
    var position = _twaver.position.get(node.getStyle('label.position'), nodeBounds, textSize);
    var unionBounds = _twaver.math.unionRect(nodeBounds, { x: position.x, y: position.y, width: textSize.width, height: textSize.height });
    var followers = node.getFollowers();
    if (followers && followers.size()) {
      followers.forEach(function (follower) {
        unionBounds = _twaver.math.unionRect(unionBounds, getUnionBounds(follower));
      });
    }
	if(node instanceof topo.circleChart){
		var width = Number(node.getStyle('component.width'));
		var height = Number(node.getStyle('component.height'));
		unionBounds.x = unionBounds.x+unionBounds.width-15;
		unionBounds.y = unionBounds.y+unionBounds.height-height-35;
		unionBounds.width = width+unionBounds.width-15;
		unionBounds.height = height+unionBounds.height+35;
	}
    return unionBounds;
  }

TopoConfiguration = function () {//说明在这个方法中所有的this都是指TopoConfiguration的当前对象，即当进入组态配置的界面后这个对象就是组态配置的所有信息都在这个里面
    this.box = new ElementBox();                                                     //数据容器
    this.layerBox = this.box.getLayerBox();          
    this.layer1 = new twaver.Layer("1");
    this.layer2 = new twaver.Layer("2");
    this.layerBox.add(this.layer1);
    this.layerBox.add(this.layer2);
    this.network = demo.Util.createDraggableNetwork(this.box,this);                  //网络拓扑
    globleObjManager.network = this.network;
    this.sheet = new topo.PropertySheet(this.box);									//属性表单，左边的属性显示的，以键值对的方式显示
    this.imageNodesDiv = document.createElement('div');         
    this.shapeNodesDiv = document.createElement('div');
    this.varLineDiv = $("#varLine")[0];
    this.submatrixPicDiv = $("#submatrixPic")[0];     
    this.partPicDiv = $("#partPic")[0];
    this.nbqPartPicDiv = $("#nbqPartPic")[0];
    this.mainLinePicDiv = $("#mainLinePic")[0];
    this.staticTextDiv = $("#staticText")[0];
    this.dynamicTextDiv = $("#dynamicText")[0];
    this.graphsDiv = $("#ztpz-zddt-bj_body")[0];
    this.topoAreaDiv = $("#topoArea")[0];										//顶部的，用于显示相关的工具按钮的按钮
    this.proAreaDiv = $("#proArea")[0];											//右边上半部分的属性栏
    this.sunAreaDiv = $("sunArea")[0];											//右边下半部分的显示相关设备连接的栏
    this.fenqutuDiv = document.createElement('div');                                 //分区�?
    this.zizhenfentuDiv = document.createElement('div');                             //子阵分图
    this.accordion = new Accordion();                                                //收缩�?
    this.xmlStr = "";                                                                //box序列化XML数据
    this.treeDataBox = new ElementBox();           
    this.popupMenu = new twaver.controls.PopupMenu(this.network);                    //右键菜单
    this.interval = null;
    this.intervalBool = false;
    this.nodeid = 10000001;
    this.comfirmsaveflag = false;
    this.newConfSchemaObj = {};                                                      //保存树节点回传拓扑数据对象信�?
    this.curConfSchemaObj = {};
    this.istopnode = false;
    this.curselectnode = null;                                                       //右键操作，当前选中的元�?
    this.isRemote = false;                                                           //遥控
    this.isRemoteStart = false;
    this.isRemoteStop = false;
    this.parentTreeNodeId; 
    this.signalflag = 0;
    this.treenodetype = null;
    this.$topoalable = null ;                                                        //顶层a标签
    this.topoalablehref = null;                                                      //顶层a标签href
    window.onresize = function (e) { 
    	globleObjManager.network.invalidate();
    };

    this.network.moveSelectedElements = function (xoffset, yoffset, animate, finishFunction) {
        if (xoffset === 0 && yoffset === 0) {
            return;
        }
        var unionBounds = this.getMovableSelectedElementsRect();
        if (unionBounds == null) {
            return;
        }
        if (unionBounds.x + xoffset < bounds.x) {
            xoffset = bounds.x - unionBounds.x;

		} else if (unionBounds.x + unionBounds.width + xoffset > bounds.x + bounds.width) {
            xoffset =(bounds.x + bounds.width) - (unionBounds.x + unionBounds.width) ;
		}
        if (unionBounds.y + yoffset < bounds.y) {
            yoffset = bounds.y - unionBounds.y;
        } else if (unionBounds.y + unionBounds.height + yoffset > bounds.y + bounds.height) {
            yoffset = (bounds.y + bounds.height)-(unionBounds.y + unionBounds.height);
        }
        twaver.Util.moveElements(this.getMovableSelectedElements(), xoffset, yoffset, animate, finishFunction, this);
     };


    this.network.getMovableSelectedElementsRect = function () {
        var elements = this.getMovableSelectedElements();
        if (elements.size() === 0) {
            return null;
        }
        var unionRect = null;
        for (var i = 0, n = elements.size(); i < n; i++) {
            var element = elements.get(i);
            if (element instanceof twaver.Node) {
                unionRect = _twaver.math.unionRect(unionRect, getUnionBounds(element));
            }
        }
        return unionRect;
      };
      
      /*this.box.addDataBoxChangeListener(function(e) {
    	  if ("add" == e.kind ) {
    		  if(e.data instanceof topo.ShapeNode){
    			  e.data.setClient("nodetypeid","51");
    			  e.data.setClient("nodetypename","不规则节点");
    		  }
    	  } 
      });*/
};


twaver.Util.ext('TopoConfiguration', Object, {
    init: function () {
    	var self = this;
    	twaver.Defaults.FONT = Msg.topocfg.font12;
        this.initDialog();																						//初始化对话框，对于组态配置界面中需要弹出的对话框都可以在这里初始化，并且初始化了一些对话框中的下拉列表的Change事件
        this.registImages();                                                                                     //注册图片
        var toolbar = document.createElement('div');                                                             //网络拓扑工具�?
        this.initToolBar();
        demo.Util.appendChild(this.sheet.getView(), self.proAreaDiv, 0, 0, 0, 0);
        demo.Util.appendChild(this.network.getView(), self.topoAreaDiv, 45, 2, 2, 2);
		this.network.getView().style.border="1px solid #09234A";
		this.network.getView().style.overflow = "auto";
        this.network.getView().style.background = "url('/images/ztpz/bg.png') 0 0 repeat";
		this.sheet.getView().style.paddingTop = '10px';
        this.sheet.setEditable(true);
        this.initSheet();                                                                                       //初始化属性表�?
		this.isdistribute();
        this.initTabs();
        this.initPopupMenu();
        this.initSun();
        this.initCurConfSchemaObj();
        this.network.setKeyboardRemoveEnabled(false);                                                           //禁止delete�?
        this.network.setSelectFillColor("none");                                                                //框选时的背景色
        twaver.Styles.setStyle('select.style', 'shadow');
        twaver.Styles.setStyle('select.color', "#555555");
        twaver.Styles.setStyle('shadow.blur', 2);
        twaver.Styles.setStyle('shadow.xoffset', 5);
        twaver.Styles.setStyle('shadow.yoffset', 5);
        this.box.addDataPropertyChangeListener(function(e){
    		if(e.property == "width" && !proflag){
    			fixNodeLocation(e.source);
    			if((e.source instanceof topo.HengXian) || (e.source instanceof topo.ShuXian) || (e.source instanceof topo.ShangJianTou)
            			|| (e.source instanceof topo.JieDiKaiGuanZuo)|| (e.source instanceof topo.DiXianYou)){
    				 var valuetemp = (((e.newValue < 1) ||(e.newValue > 800) || isNaN(e.newValue)) ? e.oldValue:e.newValue);
        			 e.source.setWidth(valuetemp);
                     self.box.getSelectionModel().appendSelection(e.source);
    			}
    			if((e.source instanceof topo.Table) || (e.source instanceof topo.GuangZiPai) ||  (e.source instanceof topo.StatusButton) || (e.source instanceof topo.SkipButton) || (e.source instanceof topo.IndexNode)){
					fixNodeLocation(e.source);	
					var valuetemp ;
					if(e.newValue < 10){
						valuetemp = 10;
					}
					else if(e.newValue > 800 ){
						valuetemp = e.oldValue;
					}
					else{
						valuetemp = e.newValue;
					}
        			e.source.setWidth(valuetemp);
                }
        	}
    		if(e.property == "height" && !proflag){
    			fixNodeLocation(e.source);
    			if((e.source instanceof topo.HengXian) || (e.source instanceof topo.ShuXian) || (e.source instanceof topo.ShangJianTou)
            			|| (e.source instanceof topo.JieDiKaiGuanZuo)|| (e.source instanceof topo.DiXianYou)){
    				 var valuetemp = (((e.newValue < 1) ||(e.newValue > 800) || isNaN(e.newValue)) ? e.oldValue:e.newValue);
        			 e.source.setHeight(valuetemp);
                     self.box.getSelectionModel().appendSelection(e.source);
    			}
    			if((e.source instanceof topo.Table) || (e.source instanceof topo.GuangZiPai) ||  (e.source instanceof topo.StatusButton)   ||  (e.source instanceof topo.SkipButton) || (e.source instanceof topo.IndexNode)){
    				var valuetemp ;
					if(e.newValue < 10){
						valuetemp = 10;
					}
					else if(e.newValue > 800 ){
						valuetemp = e.oldValue;
					}
					else{
						valuetemp = e.newValue;
					}
        			e.source.setHeight(valuetemp);
    			}
        	}
    		if(e.property == "S:grid.column.count"){
    			if((e.source instanceof topo.Table)){
    				 var valuetemp = (((e.newValue < 1) ||(e.newValue > 25) || isNaN(e.newValue)) ? e.oldValue:parseInt(e.newValue));
        			 e.source.setStyle("grid.column.count",valuetemp);
                     self.box.getSelectionModel().appendSelection(e.source);
    			}
    			
    			if((e.source instanceof topo.JZZuChuan)){
	   				 var valuetemp = (((e.newValue < 1) ||(e.newValue > 25) || isNaN(e.newValue)) ? e.oldValue:parseInt(e.newValue));
	       			 e.source.setStyle("grid.column.count",valuetemp);
	       			 e.source.setSize(e.source.getStyle("grid.column.count")*38,e.source.getStyle("grid.row.count")*15);
	                 
	                 var children = e.source.getChildren();   
		       		 var len = children.size();                                                    
					 for(var i = len - 1;i >= 0 ;i--){
						 var tempfollowers = children.get(i);
						 if(tempfollowers){
							 self.box.remove(children.get(i));
						 }
					 }
	                
	                 for(var i=0;i<e.source.getStyle("grid.column.count");i++){
	         	    	for(var j=0;j<e.source.getStyle("grid.row.count");j++){
	         	    		var cell=new twaver.Grid();
	         	    		cell.setImage("zuchuanlan");
	         	    		cell.setStyle("follower.row.index",j);
	         	    		cell.setStyle("follower.column.index",i);
	         	    		cell.setStyle('label.color', "#ffffff");
	         	    		cell.setStyle('label.position', "bottom.bottom");
	         	    		cell.setStyle('label.font', Msg.topocfg.font12);
	         	    		cell.setHost(e.source);
	         	    		e.source.addChild(cell);
					        self.box.add(cell);
	         	    	}
	         	    }
	                 
                    self.box.getSelectionModel().appendSelection(e.source);
   			    }
   			   
           	}
       		if(e.property == "S:grid.row.count"){
       			if((e.source instanceof topo.Table)){
       				var valuetemp = (((e.newValue < 1) ||(e.newValue > 25) || isNaN(e.newValue)) ? e.oldValue:parseInt(e.newValue));
	       			e.source.setStyle("grid.row.count",valuetemp);
	                self.box.getSelectionModel().appendSelection(e.source);
       			}
       			if((e.source instanceof topo.JZZuChuan)){
	   				 var valuetemp = (((e.newValue < 1) ||(e.newValue > 25) || isNaN(e.newValue)) ? e.oldValue:parseInt(e.newValue));
	       			 e.source.setStyle("grid.row.count",valuetemp);
	       			 e.source.setSize(e.source.getStyle("grid.column.count")*38,e.source.getStyle("grid.row.count")*15);
	       			 
	       			 var children = e.source.getChildren();   
		       		 var len = children.size();                                                    
					 for(var i = len - 1;i >= 0 ;i--){
						 var tempfollowers = children.get(i);
						 if(tempfollowers){
							 self.box.remove(children.get(i));
						 }
					 }
	                
	                 for(var i=0;i<e.source.getStyle("grid.column.count");i++){
	         	    	for(var j=0;j<e.source.getStyle("grid.row.count");j++){
	         	    		var cell=new twaver.Grid();
	         	    		cell.setImage("zuchuanlan");
	         	    		cell.setStyle("follower.row.index",j);
	         	    		cell.setStyle("follower.column.index",i);
	         	    		cell.setStyle('label.color', "#ffffff");
	         	    		cell.setStyle('label.position', "bottom.bottom");
	         	    		cell.setStyle('label.font', Msg.topocfg.font12);
	         	    		cell.setHost(e.source);
	         	    		e.source.addChild(cell);
					        self.box.add(cell);
	         	    	}
	         	    }
					 
					 self.box.getSelectionModel().appendSelection(e.source);
  			    }
           	}
        	/*if (e.property === 'location' && !proflag) {
                fixNodeLocation(e.source);
            }*/
        	if (e.property === 'S:label.position' && !proflag) {
                fixNodeLocation(e.source);
            }
        	if (e.property === 'S:label.font' && !proflag) {
                fixNodeLocation(e.source);
            }
        	if (e.property === 'S:label.xoffset' && !proflag) {
                fixNodeLocation(e.source);
            }
        	if (e.property === 'S:label.yoffset' && !proflag) {
                fixNodeLocation(e.source);
            }
        	if (e.property === 'name' && !proflag) {
                fixNodeLocation(e.source);
            }
            if (e.property === 'vector.shape' && !proflag) {
                fixNodeLocation(e.source);
            }
        });
        this.network.setEditableFunction(function (element) {
        	return self.isNodeEditable(element);
        });
        this.changeToolBar(true);
        this.changeBodyRect();
        this.handleWindowClose();
        this.network.addInteractionListener(function(e){
        	if((e.kind == "clickElement")&& self.treenodetype == "tpl"){          //模板不能连线
        		self.network.setDefaultInteractions();
        	}
        	if(e.kind == 'createElement'){
        		self.network.getSelectionModel().clearSelection();
        	}
        	if (e.kind === 'clickElement') {
  	          if (e.element instanceof twaver.Follower) {
  	            var host = e.element.getHost();
  	            if (host instanceof twaver.Grid) {
  	              this.network.getSelectionModel().setSelection(host);
  	            }
  	          }
  	          //及时刷新IP和二级地址
	  	        if ((e.element instanceof topo.XiangBian) || (e.element instanceof topo.NiBianQi) || (e.element instanceof topo.ShuJuCaiJiQi)|| (e.element instanceof topo.TGJ)
          			  || (e.element instanceof topo.DianBiao) || (e.element instanceof topo.gkDianBiao) || (e.element instanceof topo.hjzDianBiao) || (e.element instanceof topo.cydFactoryDianBiao) || (e.element instanceof topo.cydFactoryNonDianBiao)
          			  || (e.element instanceof topo.HuJingJianCeYi) || (e.element instanceof topo.JLHuiLiuXiang)|| (e.element instanceof topo.ZLHuiLiuXiang)|| (e.element instanceof topo.JZNiBianQi) || (e.element instanceof topo.pidTopo) || (e.element instanceof topo.TongYong)) {
	  	        	var deviceid = e.element.getClient("deviceid");
	  	        	if(deviceid || "0" == deviceid){
	  	            //做一个XML时间戳的校验
	  	        	//是否提交校验
	  	        	var btnYes = Msg.topocfg.yes;
	  	      		var btnNo = Msg.topocfg.no;	
	  	      		var setting = new twaver.SerializationSettings();
	  	      		self.setClientPropertyType(setting);
	  	      		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
	  	      		var checkConfSchemaObj = {};
	  	      		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
	  	      		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
	  	      		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
	  	      		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
	  	      		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
	  	      		var objcv = {
	  	         				buttons:{
	  	      				}
	  	      	   		};
	  	  	   		objcv.buttons[btnYes] = function(){
	  	  	   			$( this ).dialog( "close" );
	  	  				topoComon.devNodeChoseUpdateXML(deviceid,e,self);
	  	  			};
	  	  			objcv.buttons[btnNo] = function(){
	  	  				$( this ).dialog( "close" );
	  	  		    };
	  	      		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
	  	      			if(data.success){      
	  	      				topoComon.devNodeChoseUpdateXML(deviceid,e,self);       //是最新，可以更新
	  	      			}
	  	      			else{                 
	  	      				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
	  	      				$("#isContinueSaveTopoDatadlg").dialog("open");
	  	      			}
	  	      		},false);
	  	        	
	  	        	}
	  	         }
  	        }
		});
	    this.network.getSelectionModel().setFilterFunction(function (element) {
	        if (element instanceof twaver.Follower && element.getHost() instanceof twaver.Grid) {
	          return false;
	        }
	        return true;
	      });
	    this.registerUserImageList();
	    this.box.addDataBoxChangeListener(function(e) {
	    	  if ("add" == e.kind ) {
	    		  if(e.data instanceof topo.ShapeNode){
	    			  e.data.setClient("nodetypeid","51");
	    			  e.data.setClient("nodetypename","不规则节点");
	    			 /* e.data.setStyle("vector.outline.color","#FF0000");
	    			  e.data.setStyle("vector.fill.color","#00FF00");*/
	    		  }
	    		 /* if(e.data instanceof topo.ImageNode){
	  	  			  e.data.setLayerId(self.layer1.getId());
	  	  		  }
	  		  	  else{
	  		  		  e.data.setLayerId(self.layer2.getId());
	  		  	  }*/
	    		  if(!(e.data instanceof topo.ImageNode) && !(e.data instanceof topo.Table)){
	    			  if(e.data instanceof topo.Text){
		  	  			  e.data.setLayerId(self.layer2.getId());
		  	  		  }
		  		  	  else{
		  		  		  e.data.setLayerId(self.layer1.getId());
		  		  	  }
	    		  }
	    	  } 
	      });
    },


	isdistribute:function(){
		var self = this;
		$.omcAjax("/cm/SchemaNodeBind/isdistribute",{}, function (data) {
			if(data.success){
				distribute = data.data;
			}else{
				$("#alertmsg").html("");
				$("#alertmsg").html(Msg.topocfg.isdistributeerror);
				$("#alertdlg").dialog("open");
			}
		},false);
	},
    
    registerUserImageList:function(){
    	var self = this;
    	var objInfo = {};
		$.omcAjax("/cm/userNodePic/getImageList", objInfo, function (data) {
            if (data.success == false){
            	     $("#alertmsg").html("");
            	     $("#alertmsg").html(data.data.message);
		             $("#alertdlg").dialog("open");
     				 return false;
     			 }
     			 if(data.success == true){
     				 var piclist = data.data;
     				 if(piclist.length > 0){
     					 for(var i = 0;i < piclist.length ;i++){
     						self.registerImage("/module/topo/images/userimages/"+piclist[i]);
     					 }
     				 }
     			 }
     	});
    },
    
    /**
     * 透明图片范围选择
     */
    changeBodyRect:function(){                                                                   
    	var old_hit = twaver.network.NodeUI.prototype.hit;
        twaver.network.NodeUI.prototype.hit = function (x, y) {
				  var bodyRect = this.getBodyRect();
			      if (_twaver.math.containsPoint(bodyRect, x, y)) {
			          return true;
			      } 
			      else{
			          return old_hit.apply(this, arguments);
			      }
        };
        var old_intersects = twaver.network.NodeUI.prototype.intersects;
        twaver.network.NodeUI.prototype.intersects = function (rect) {
	          if(this.getElement() instanceof topo.Table || this.getElement() instanceof topo.ShapeNode || this.getElement() instanceof topo.ShouChe){
	        	   return old_intersects.apply(this, arguments);
	      	  }
	      	  else{
	      		var bodyRect = this.getBodyRect();
	            if(_twaver.math.intersects(bodyRect, rect)) {
	                return true;
	            } 
	            else{
	                return old_intersects.apply(this, arguments);
	            }
	      	  }
        };
    },
    
   
    
    /**
     * 点击透明区域是否可以拖动图元
     */
    isDragNode:function(x,y){ 
    	
    	
    },
    
    /**
     * 是否可以编辑
     */
    isNodeEditable:function(element){                                                                   //横竖线，表格，光字牌，按�?箭头，地线，刀�?
   	    return ((element instanceof topo.HengXian) || (element instanceof topo.ShuXian) || 
   	    		(element instanceof topo.Table) ||(element instanceof topo.GuangZiPai) || 
   	    		(element instanceof topo.SkipButton) || (element instanceof topo.IndexNode) || (element instanceof topo.JieDiKaiGuanZuo) 
   	    		||(element instanceof topo.DiXianYou) ||(element instanceof topo.ShangJianTou) || (element instanceof topo.ShapeNode)|| (element instanceof topo.ImageNode)
   	    		|| (element instanceof topo.BiLeiZhen)|| (element instanceof topo.DaiDianZZ)|| (element instanceof topo.DianRong)
   	    		|| (element instanceof topo.DianKang)|| (element instanceof topo.FLDianKang)|| (element instanceof topo.DianGan)
   	    		|| (element instanceof topo.ShouChe)|| (element instanceof topo.YuanKong) || (element instanceof topo.StatusButton) );
    },
    
    /**
     * 窗口关闭处理(主要针对点击LOGO退出时提示保存拓扑)
     */
    handleWindowClose:function(){
   	     var self = this;
	   	 $("#logoid").bind("click",function(event){
	   		self.$topoalable = $("#logoid");
	   		self.topoalablehref = "/main_menu.html";
	   		self.handleIsSaveCurTopo($("logoid"));
	     });
    },
    
    /**
     * 设置客户属性类�?
     */
    setClientPropertyType:function(setting){
    	setting.setClientType("nodetypeid","cdata");
		setting.setClientType("nodetypename","cdata");
		setting.setClientType("deviceid","cdata");
		setting.setClientType("devicename","cdata");
		setting.setClientType("hostnodeid","cdata");
		setting.setClientType("hostnodename","cdata");
		setting.setClientType("signalid","cdata");
		setting.setClientType("signalname","cdata");
		setting.setClientType("signalcolname","cdata");
		setting.setClientType("signalunit", "cdata");
		setting.setClientType("signaltype", "cdata");
		setting.setClientType("yksignalid", "cdata");
		setting.setClientType("yksignalname", "cdata");
		setting.setClientType("yksignalcolname", "cdata");
		setting.setClientType("yksignalunit", "cdata");
		setting.setClientType("yksignaltype", "cdata");
		setting.setClientType("ykkqsignalid", "cdata");
		setting.setClientType("ykkqsignalname", "cdata");
		setting.setClientType("ykkqsignalcolname", "cdata");
		setting.setClientType("ykkqsignalunit", "cdata");
		setting.setClientType("ykkqsignaltype", "cdata");
		setting.setClientType("schemaBindInfoID", "cdata");
		setting.setClientType("ykschemaBindInfoID", "cdata");
		setting.setClientType("ykkqschemaBindInfoID", "cdata");
		setting.setClientType("ykgbschemaBindInfoID", "cdata");
		setting.setClientType("ykgbsignalcolname", "cdata");
		setting.setClientType("ykgbsignalid", "cdata");                                                
		setting.setClientType("ykgbsignalname", "cdata");                                            
		setting.setClientType("ykgbsignalunit", "cdata");
		setting.setClientType("ykgbsignaltype", "cdata");
		setting.setPropertyType("id","string");
		setting.setPropertyType("image","cdata");
		setting.setClientType("bussinessCode","cdata");
		setting.setClientType("ESN","cdata");              
		setting.setClientType("name","cdata");   
		setting.setClientType("ip","cdata");   
		setting.setClientType("modelVersionID","cdata");
		setting.setClientType("topographid", "cdata");
		setting.setClientType("picpath", "cdata");
		setting.setClientType("secondaddress", "cdata");
		setting.setClientType("topographname", "cdata");
		setting.setClientType("modelVersionName", "cdata");
		setting.setPropertyType("angle", "number");
		setting.setClientType("highvswitch", "cdata");
		setting.setClientType("lowvcircuitbreaker1", "cdata");
		setting.setClientType("lowvcircuitbreaker2", "cdata");
		setting.setClientType("kksCode", "cdata");
		setting.setClientType("capacity", "cdata");
		setting.setClientType("parentdevid", "cdata");
		setting.setClientType("parentdevName", "cdata");
		setting.setClientType("devProColName", "cdata");
		setting.setClientType("devProName", "cdata");
		setting.setClientType("texttype", "cdata");  
		setting.setClientType("devProId", "cdata");
		setting.setClientType("relationKeyId", "cdata");
		setting.setClientType("devicePort", "cdata");
		setting.setClientType("signalobject", "cdata");
		setting.setClientType("signalkind", "cdata");
		setting.setStyleType("component.width", "cdata");
		setting.setStyleType("component.height", "cdata");
		setting.setStyleType("component.fillcolor", "cdata");
		setting.setStyleType("circleChart.color", "cdata");
	},
    
    /**
     * 离开组态页面时确认是否保存当前拓扑
     */
    handleIsSaveCurTopo:function(){
		var self = this;
		var setting = new twaver.SerializationSettings();
		self.setClientPropertyType(setting);
        var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                         //得到当前工作区的当前XML
        var curxmldata = xmlSerializer.serialize();
        if(self.curConfSchemaObj.busiObjectId && self.curConfSchemaObj.schemaData.trim() != curxmldata.trim()){                                //比较当前工作区是否编�? ，有编辑
        	$("#leavecomfirmsavetoppdatadlg").dialog("open");
        }
        else{
        	window.location.href = self.topoalablehref;
        }
    },
    
    
    /**
     * 注册用户自定义的图片
     */
    registerUserImages:function(){
   	     var self = this;
   	     var datanodes = self.box.getDatas();
   	     datanodes.forEach(function(e){
   	    	if(e.getClient("nodetypeid") == 30)
   	    	var imagefullname = e.getClient("picpath");              //文件名，有后缀
   	    	if(imagefullname){
   	    		self.registerImage("/module/topo/images/userimages/"+imagefullname);
   	    	}
	     });
   },
   
   /**
    * 得到拓扑图序列化数据
    */
   getTopoXmlData:function(){
	     var self = this;
         var setting = new twaver.SerializationSettings();
         self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                         //得到当前工作区的当前XML
         return  xmlSerializer.serialize(); 
  },
    
    /**
     * 清空拓扑数据
     */
    isTopoDataEmpty:function(){
   	     var self = this;
   	     var initxmldata =  self.getTopoInitData();
         var setting = new twaver.SerializationSettings();
         self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                         //得到当前工作区的当前XML
         var curxmldata = xmlSerializer.serialize(); 
         return (initxmldata == curxmldata);
   },
    
    
    /**
     * 删除拓扑数据
     */
    deleteTopoData:function(){
   	     var self = this;
    	 self.box.clear();
   	     self.curConfSchemaObj.schemaData = self.getTopoInitData();
   	     self.curConfSchemaObj.busiObjectId = "";
         self.curConfSchemaObj.schemeTypeId = "";
         self.curConfSchemaObj.id = "";
         self.curConfSchemaObj.timeStamp = "";
         self.newConfSchemaObj.schemaData = "";
   	     self.newConfSchemaObj.busiObjectId = "";
         self.newConfSchemaObj.schemeTypeId = "";
         self.newConfSchemaObj.id = "";                                                         //当前工作区没有编�?,切换拓扑�?
         self.newConfSchemaObj.timeStamp = "";
   },
    
    
    /**
     * 清空拓扑数据
     */
    clearTopoData:function(){
   	     var self = this;                                                                        //清空之前要做确认一个保存动�?
   	     var setting = new twaver.SerializationSettings();
   	     self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                         //得到当前工作区的当前XML
         var curxmldata = xmlSerializer.serialize();       
	     if(self.curConfSchemaObj.busiObjectId && self.curConfSchemaObj.schemaData != curxmldata){                                     //比较当前工作区是否编�? ，有编辑
	     	 $("#comfirmsavetoppdatadlg").dialog("open");
	     }
	     else{
	    	 self.box.clear();
	   	     self.curConfSchemaObj.schemaData = self.getTopoInitData();
	   	     self.curConfSchemaObj.busiObjectId = "";
	         self.curConfSchemaObj.schemeTypeId = "";
	         self.curConfSchemaObj.id = "";
	         self.newConfSchemaObj.schemaData = "";
	   	     self.newConfSchemaObj.busiObjectId = "";
	         self.newConfSchemaObj.schemeTypeId = "";
	         self.newConfSchemaObj.id = "";                                                         //当前工作区没有编�?,切换拓扑�?
	     }
   },
    
    /**
     * 初始化当前页面拓扑数�?
     */
    initCurConfSchemaObj:function(){
   	     var self = this;
   	     var setting = new twaver.SerializationSettings();
   	     self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(self.box,setting);
         self.curConfSchemaObj.schemaData = xmlSerializer.serialize();                              //初始化当前当前工作区的原始XML
   },
    
    /**
     * 比较新旧拓扑数据
     */
    changeTreeNode:function(){
    	 var self = this;
    	 var setting = new twaver.SerializationSettings();
    	 self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                         //得到当前工作区的当前XML
         var curxmldata = xmlSerializer.serialize();
         if(self.curConfSchemaObj.busiObjectId && self.curConfSchemaObj.schemaData != curxmldata){                                     //比较当前工作区是否编�? ，有编辑
        	 $("#comfirmsavetoppdatadlg").dialog("open");
         }
         else{
        	 self.changeTopoGraph();                                                             //当前工作区没有编�?,切换拓扑�?
         }
    },
    
    /**
     * 更新拓扑�?
     */
    updateTopoData:function(){
    	 var self = this;
    	 var setting = new twaver.SerializationSettings();               //先确认是否保存拓扑数�?
    	 self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(self.box,setting);
         var ConfSchemaInfo = {};
         ConfSchemaInfo.schemaData = xmlSerializer.serialize();
         ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
         ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
         ConfSchemaInfo.id = self.curConfSchemaObj.id;
    	 $.omcAjax("/cm/ConfSchemaInfo/update",ConfSchemaInfo , function(data) {
	       	 if(data.success == false){
	       		 /*$("#alertdlg").dialog({height:180});*/
	       		 topo.Util.failTip(data,Msg.topocfg.updatetopofail);  	//  更新拓扑图失�?
	       	 }
	       	 else{
	       		 if(!self.istopnode){
	       			 self.changeTopoGraph();            //切换拓扑�?        
	       		 }
	       		 else{
	       			 self.box.clear();
	   	   	     	 self.curConfSchemaObj.schemaData = self.getTopoInitData();
	   	   	     	 self.curConfSchemaObj.busiObjectId = "";
	   	   	     	 self.curConfSchemaObj.schemeTypeId = "";
	   	   	     	 self.curConfSchemaObj.id = "";
	   	   	         self.curConfSchemaObj.timeStamp = "";
	   	   	     	 self.newConfSchemaObj.schemaData = "";
	   	   	     	 self.newConfSchemaObj.busiObjectId = "";
	   	   	     	 self.newConfSchemaObj.schemeTypeId = "";
	   	   	     	 self.newConfSchemaObj.id = ""; 
	   	   	         self.newConfSchemaObj.timeStamp = "";
	       		 }
	       	 }
       	},false); 
    },
    
    
    /**
     * 初始化拓扑图数据
     */
    getTopoInitData:function(){
    	 var self = this;
    	 var box = new ElementBox();
    	 var layerBox = box.getLayerBox();
    	 var layer1 = new twaver.Layer("1");
    	 var layer2 = new twaver.Layer("2");
    	 layerBox.add(layer1);
    	 layerBox.add(layer2);
    	 //var network = demo.Util.createDraggableNetwork(box);                           
    	 var setting = new twaver.SerializationSettings();
    	 self.setClientPropertyType(setting);
         var xmlSerializer = new twaver.XmlSerializer(box,setting);
         return xmlSerializer.serialize();
    },
    
    
    /**
     * 切换拓扑�?
     */
    changeTopoGraph:function(){
    	 var self = this;
    	 if(!self.newConfSchemaObj.schemaData){                                       //如果新树节点没有对应的拓扑数�?
    		 self.newConfSchemaObj.schemaData = self.getTopoInitData();
    	 }
    	 self.box.clear();
		 var setting = new twaver.SerializationSettings();                            //反序列化XML数据到当前拓�?
		 self.setClientPropertyType(setting);
		 var xmlSerializer = new twaver.XmlSerializer(self.box,setting);
		 xmlSerializer.deserialize(self.newConfSchemaObj.schemaData, null);
		 self.registerUserImages();                                                   //注册自定义的图片
		 self.curConfSchemaObj.schemaData = self.newConfSchemaObj.schemaData;
   	     self.curConfSchemaObj.busiObjectId = self.newConfSchemaObj.busiObjectId;
         self.curConfSchemaObj.schemeTypeId = self.newConfSchemaObj.schemeTypeId;
         self.curConfSchemaObj.id = self.newConfSchemaObj.id;
         self.curConfSchemaObj.timeStamp = self.newConfSchemaObj.timeStamp;
         var boxtemp =self.box;
  	     boxtemp.getDatas().forEach(function(e){
  	    	 var nodetypeid = e.getClient("nodetypeid");
  			 if(nodetypeid==66){
  				 e.lineChart.getView().style.width = e.getStyle("component.width")+"px";
  				 e.lineChart.getView().style.height = e.getStyle("component.height")+"px";
  				 e.lineChart.getDataBox()._dataList.forEach(function(datas) {
  	        		 datas.setStyle('chart.color',e.getStyle('circleChart.color'));
  	        	 });

  			 }
  	    });
    },
    
    /**
     * 得到未阳光化的设�?不断刷新)
     */
    initSun:function(){
    	topo.Util.getNotSunDevice();
    	var timerGetNotSunDevice = window.setInterval(topo.Util.getNotSunDevice, 5000);
    },
    
    /**
     * 根据所选设备获取设备信�?
     */
    devChooseChange: function(lastData,flag,devorver){
    	var  selectvalue  = $("#selectedNode").val();
    	var  selectvaluearr = selectvalue.split("@@");
    	var modelversionid = selectvaluearr[2];
    	var nodetypeid = lastData.getClient("nodetypeid");
    	if((nodetypeid == 6)||(nodetypeid == 8)||(nodetypeid == 46) ||(nodetypeid == 67)){    //组串
    		if(nodetypeid == 6){
    			$("#dlgChoAssNode" ).dialog({
    				height:370
				});
//    			$("#devNumber").hide();
    		}
    		else if(nodetypeid == 46){ //集中式组�?
    			$("#dlgChoAssNode" ).dialog({
    				height:300
				});
//    			$("#devNumber").show();
    		}
    		else if(nodetypeid == 8){
    			$("#dlgChoAssNode" ).dialog({
    				height:300
				});
//    			$("#devNumber").hide();
    		}
    		else{
    			$("#dlgChoAssNode" ).dialog({
    				height:430
				});
    		}
//    		$("#capacityDiv").show();
    		var sbId = selectvaluearr[0];//设备id
    		$.omcHttp.POST("/cm/dev/getDevPVConnectInfo",{"devId":sbId},function(res){
    			if(res.success){
    				if(res.data.pvConnectInfo == undefined){
    					$("#inputDevCapacity").val("");
    				}else{
    					if(res.data.pvConnectInfo && res.data.pvConnectInfo.PV1 > 0){
        					var rd = res.data.pvConnectInfo;
        					$("#inputDevCapacity").val(rd.PV1);
        				}
        				else{
        					$("#inputDevCapacity").val(lastData.getClient("capacity"));
        				}
    				}
    			}
    		});
    		topo.Util.getDeviceSignalTwo(modelversionid,lastData);
    	}
    	else{
    		$("#dlgChoAssNode" ).dialog({
				height:400
			});
//    		$("#capacityDiv").hide();
//    		$("#devNumber").hide();
    		topo.Util.getDeviceSignalThree(modelversionid,lastData,flag,devorver);
    	}
	},  
	
    calSignalChanged: function(curselectnode, signalflag) {
        var signalName = $('#calcSigSelect').val();
        if(signalName != undefined && signalName != '') {
            var signalModel = signalName.split("@@");
            var calcSignalName = signalModel[0];
            var calcSignalKind = signalModel[2];
            var calcSigBelongDiv = $('#calcSigBelongDiv');
            var calcSigBelongSelect = $('#calcSigBelongSelect');
            calcSigBelongSelect.val('');
            if (calcSignalKind == 3) {
                $.omcAjax('/northCalculate/getSndCalcSignals', {'signalName': calcSignalName}, function(res) {
                    var hasSndSelect = res.data.hasSndSelect;
                    var signalBelongs = res.data.signalBelongs;
                    var signalObjectType = res.data.signalObjectType;
                    var calcSigBelongSelect = $('#calcSigBelongSelect');
                    var lastSigObj;
                    var nodeTypeId = curselectnode.getClient('texttype');
                    if(nodeTypeId == 3) {
                        lastSigObj = curselectnode.getClient("signalobject");
                    }
                    
                    calcSigBelongSelect.html('');
                    if (hasSndSelect) {
                        calcSigBelongDiv.show();
                        if (signalObjectType == 1) {
                            for(var i=0; i<signalBelongs.length; i++) {
                                if (lastSigObj == signalBelongs[i].busiCode) {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].busiCode+'" name="'+signalBelongs[i].name+'" selected>'+signalBelongs[i].name+'</option>')
                                } else {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].busiCode+'" name="'+signalBelongs[i].name+'" >'+signalBelongs[i].name+'</option>')
                                }
                            }
                        } else if (signalObjectType == 2) {
                            for(var i=0; i<signalBelongs.length; i++) {
                                if (lastSigObj == signalBelongs[i].id) {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].id+'" name="'+signalBelongs[i].name+'" selected>'+signalBelongs[i].name+'</option>')
                                } else {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].id+'" name="'+signalBelongs[i].name+'" >'+signalBelongs[i].name+'</option>')
                                }
                            }
                        }
                    } else {
                        calcSigBelongDiv.hide();
                    }
                });
            } else {
                calcSigBelongDiv.hide();
            }
        }
    },

	
	chooseDevFromDBChange: function(lastData){
		topo.Util.getDeviceInfo(lastData);
	},
    
	/**
     *  更新当前拓扑
     */
    updateCurTopo: function(){
    	var self = this;
    	var ConfSchemaInfo = {};
        ConfSchemaInfo.schemaData = self.getTopoXmlData();
        ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
        ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
        ConfSchemaInfo.id = self.curConfSchemaObj.id;
        $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
            if (data.success == false) {
            	/*$("#alertdlg").dialog({height:180});*/
            	topo.Util.failTip(data,Msg.topocfg.updatetopofail);  	//  更新拓扑图
                return false;
            }
            else {
            	 self.curConfSchemaObj.schemaData = self.getTopoXmlData();
            	 self.curConfSchemaObj.timeStamp = data.data.timeStamp;
            	 $("#alertmsg").html("");
            	 /*$("#alertdlg").dialog({height:180});*/
            	 $("#alertmsg").html(Msg.topocfg.savesuccess);                 //保存成功
                 $("#alertdlg").dialog("open");
            }
        });
	},  
	
	
	/**
     * 初始化对话框
     */
    initchoosedevdlg:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 310,
    			height:192,
    			title:Msg.topocfg.associatedev,                                    //关联设备
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
    		//是否提交校验
    		var setting = new twaver.SerializationSettings();
    		self.setClientPropertyType(setting);
    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
    		var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
    		var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.associateDevOKFun(self);
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
    			if(data.success){      
    				$( "#choosedevdlg" ).dialog("close");
    				topoComon.associateDevOKFun(self);
    			}
    			else{                 
    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
    				$("#isContinueSaveTopoDatadlg").dialog("open");
    			}
    		},false);
    		    
    	}
    	obj.buttons[buttoncancel] = function(){
    		    $( this ).dialog( "close" );
    	}
    	$( "#choosedevdlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },

	otherEMIdevdlg:function(){                      
		var self = this;
		var buttonok = Msg.topocfg.sure;
		var buttoncancel = Msg.topocfg.cancel;
		var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
		var obj = {
			position:{at:"center"},
			autoOpen: false,
			resizable:false,
			width: 310,
			height:170,
			title:Msg.topocfg.associateotherstation,                                    //关联设备
			modal: true,
			buttons:{},
			close:function(){
				var optobj = $(this).dialog("option","position");
				optobj.my = "center";
				optobj.at = "center",
					$(this).dialog("option","position",optobj);
			}
		};
		obj.buttons[buttonok] = function(){
			/*var selectednode = self.network.getSelectionModel().getLastData();
			var nodetypeid = selectednode.getClient("nodetypeid");
			var deviceinfo = $("#otherEMIdev").val();
			if(!deviceinfo){
				$("#alertmsg").html("");
				$("#alertmsg").html(Msg.ztpz.pleaseSelectDev);                //请选择设备
				$("#alertdlg").dialog("open");
				return false;
			}
			var schemaNodeBindInfo = {}
			schemaNodeBindInfo.bindType = 5;
			schemaNodeBindInfo.parentNodeGuid = "";
			schemaNodeBindInfo.pelNodeGuid = selectednode.getId();
			schemaNodeBindInfo.bindObjectId = $("#otherEMIdev").val().split("@@")[0];
			schemaNodeBindInfo.schemaID = self.curConfSchemaObj.id;
			topo.Util.addOtherEMI(schemaNodeBindInfo,selectednode,self);*/
			//是否提交校验
			var setting = new twaver.SerializationSettings();
			self.setClientPropertyType(setting);
			var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
			//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
			var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
			var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.associateotherstationOKFun(self);
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
			$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
				if(data.success){                         
					topoComon.associateotherstationOKFun(self);
				}
				else{                
					$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
					$("#isContinueSaveTopoDatadlg").dialog("open");
				}
			},false);
		}
		obj.buttons[buttoncancel] = function(){
			$( this ).dialog( "close" );
		}
		$( "#otherEMIdevdlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
	},
	
    /**
     * 更换图片
     */
    initchangepicdlg:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 480,
    			height:360,
    			title:Msg.topocfg.changepic,                                    
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
    		/*var selectednode = self.network.getSelectionModel().getLastData();
			var selectvalue = $("#picPathSel").val();
			if(!selectvalue){
				 $("#alertmsg").html("");
				 $("#alertdlg").dialog({height:180});
      	     	 $("#alertmsg").html(Msg.topocfg.plechosepic);                                 //没有选择图片
	             $("#alertdlg").dialog("open");
	             return false;
			}
			var imagename = demo.Util.getImageName(selectvalue);
			self.registerImage("/module/topo/images/userimages/"+selectvalue);
			selectednode.setImage(imagename);
			var newobj = new topo.ImageNode();
			newobj.setClient("picpath",selectvalue);
			newobj.setStyle('label.xoffset', selectednode.getStyle('label.xoffset'));
			newobj.setStyle('label.yoffset', selectednode.getStyle('label.yoffset'));
			newobj.setStyle('label.color', selectednode.getStyle('label.color'));
			newobj.setStyle('label.position', selectednode.getStyle('label.position'));
			newobj.setClient('nodetypeid', selectednode.getClient('nodetypeid'));
			newobj.setClient('nodetypename', selectednode.getClient('nodetypename'));
			newobj.setLocation(selectednode.getLocation());
			newobj.setName(selectednode.getName());
			newobj.setImage(imagename);
			$("#input_text").val("");
			$("#picUpLoadFile").val("");
			self.box.remove(selectednode);
			self.box.add(newobj);
			if(newobj.getWidth() > WIDTH){
				newobj.setWidth(WIDTH);
    		}
    		if(newobj.getHeight() > HEIGHT){
    			newobj.setHeight(HEIGHT);
    		}
			fixNodeLocation2(newobj);
			self.updateCurTopo();*/
    		
    		//是否提交校验
    		var setting = new twaver.SerializationSettings();
    		self.setClientPropertyType(setting);
    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
    		var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
    		var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.changePicOKFun(self);
				$( "#changepicdlg" ).dialog( "close" ); 
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
    			if(data.success){                         
    				topoComon.changePicOKFun(self);
    				$( "#changepicdlg" ).dialog( "close" ); 
    			}
    			else{                
    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
    				$("#isContinueSaveTopoDatadlg").dialog("open");
    			}
    		},false);
			//$( this ).dialog( "close" );        
    	}
    	obj.buttons[buttoncancel] = function(){
    		    $( this ).dialog( "close" );
    	}
    	$( "#changepicdlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    /**
     * 是否保存当前拓扑�?
     */
    initcomfirmsavetoppdatadlg:function(){
    	var self = this;
    	var buttonyes = Msg.topocfg.yes;
    	var buttonno = Msg.topocfg.no;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 310,
    			height:160,
    			title:Msg.topocfg.message,                                   
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonyes] = function(){
    		//$( this ).dialog( "close" );  
    		//是否提交校验
    		var setting = new twaver.SerializationSettings();
    		self.setClientPropertyType(setting);
    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
    		var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
    		var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				self.updateTopoData();
				$(  "#comfirmsavetoppdatadlg" ).dialog( "close" );  
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
				if(!self.istopnode){
					self.changeTopoGraph();                
				}
				else{                                     
					self.box.clear();
			   	    self.curConfSchemaObj.schemaData = self.getTopoInitData();
			   	    self.curConfSchemaObj.busiObjectId = "";
			        self.curConfSchemaObj.schemeTypeId = "";
			        self.curConfSchemaObj.id = "";
			        self.newConfSchemaObj.schemaData = "";
			   	    self.newConfSchemaObj.busiObjectId = "";
			        self.newConfSchemaObj.schemeTypeId = "";
			        self.newConfSchemaObj.id = "";    
				}
		    };
    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
    			if(data.success){               
    				self.updateTopoData();
    				$(  "#comfirmsavetoppdatadlg" ).dialog( "close" );
    			}
    			else{                
    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
    				$("#isContinueSaveTopoDatadlg").dialog("open");
    			}
    		},false);
			//self.updateTopoData();
    	}
    	obj.buttons[buttonno] = function(){
    		$( this ).dialog( "close" );
			if(!self.istopnode){
				self.changeTopoGraph();                
			}
			else{                                     
				self.box.clear();
		   	    self.curConfSchemaObj.schemaData = self.getTopoInitData();
		   	    self.curConfSchemaObj.busiObjectId = "";
		        self.curConfSchemaObj.schemeTypeId = "";
		        self.curConfSchemaObj.id = "";
		        self.newConfSchemaObj.schemaData = "";
		   	    self.newConfSchemaObj.busiObjectId = "";
		        self.newConfSchemaObj.schemeTypeId = "";
		        self.newConfSchemaObj.id = "";    
			}
    	}
    	$( "#comfirmsavetoppdatadlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    /**
     * 跳出组态页面时是否保存当前拓扑�?
     */
    initleavecomfirmsavetoppdatadlg:function(){
    	var self = this;
    	var buttonyes = Msg.topocfg.yes;
    	var buttonno = Msg.topocfg.no;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 310,
    			height:160,
    			title:Msg.topocfg.message,                                   
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonyes] = function(){
    		//是否提交校验
    		var setting = new twaver.SerializationSettings();
    		self.setClientPropertyType(setting);
    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
    		var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
    		var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				self.updateTopoData();
				window.location.href = self.topoalablehref;
				$("#leavecomfirmsavetoppdatadlg").dialog( "close" ); 
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
				if(!self.istopnode){
					self.changeTopoGraph();                
				}
				else{                                     
					$( this ).dialog( "close" );
					window.location.href = self.topoalablehref;  
				}
		    };
    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
    			if(data.success){               
    				self.updateTopoData();
    				window.location.href = self.topoalablehref;
    				$("#leavecomfirmsavetoppdatadlg").dialog( "close" ); 
    			}
    			else{                
    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
    				$("#isContinueSaveTopoDatadlg").dialog("open");
    			}
    		},false);
    		//$( this ).dialog( "close" );                
			//self.updateTopoData();
			//window.location.href = self.topoalablehref;
    	}
    	obj.buttons[buttonno] = function(){
    		$( this ).dialog( "close" );
    		window.location.href = self.topoalablehref;
    	}
    	$( "#leavecomfirmsavetoppdatadlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    /**
     * 关联拓扑�?
     */
    initdlgChoTopoGraph:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 350,
    			height:160,
    			title:Msg.topocfg.associatetopo,                                 
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
			var selectednode = self.network.getSelectionModel().getLastData();
			var selectvalue = $("#selectedTopoGraph").val();
			if(!selectvalue){
				 $("#alertmsg").html("");
     	     	 $("#alertmsg").html(Msg.topocfg.pleaseSelectTopo);                                 
	             $("#alertdlg").dialog("open");
	             return false;
			}
			/*if(selectednode.getClient("nodetypeid") == 4 || selectednode.getClient("nodetypeid") == 51 || selectednode.getClient("nodetypeid") == 28 || selectednode.getClient("nodetypeid") == 55){
				selectednode.setName($("#selectedTopoGraph").find("option:selected").text());
			}
			if(selectednode.getClient("nodetypeid") == 51){
				selectednode.setStyle('label.position', "center");
			}
			selectednode.setClient("topographid",selectvalue); 
			selectednode.setClient("topographname",$("#selectedTopoGraph").find("option:selected").text()); 
			self.updateCurTopo();*/
			//是否提交校验
			var setting = new twaver.SerializationSettings();
			self.setClientPropertyType(setting);
			var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
			//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
			var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
			var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.associateTopoOkFun(selectednode);
				self.updateCurTopo();
				$("#dlgChoTopoGraph").dialog( "close" );
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
			$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
				if(data.success){                  
					topoComon.associateTopoOkFun(selectednode,selectvalue);
					self.updateCurTopo();
					$("#dlgChoTopoGraph").dialog( "close" );
				}
				else{                
					$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
					$("#isContinueSaveTopoDatadlg").dialog("open");
				}
			},false);
			//$( this ).dialog( "close" );
    	}
    	obj.buttons[buttoncancel] = function(){
    		    $( this ).dialog( "close" );
    	}
    	$( "#dlgChoTopoGraph" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    /**
     * 关联逆变�?
     */
//    initAsInvDevId:function(){
//    	var self = this;
//    	var buttonok = Msg.topocfg.sure;
//    	var buttoncancel = Msg.topocfg.cancel;
//    	var obj = {
//    			position:{at:"center"},
//    			autoOpen: false,
//    			resizable:false,
//    			width: 350,
//    			height:160,
//    			title:Msg.topocfg.associateinventer,                                 
//    			modal: true,
//    			buttons:{},
//    			close:function(){
//    				var optobj = $(this).dialog("option","position");
//    			    optobj.my = "center";
//    			    optobj.at = "center",
//    			    $(this).dialog("option","position",optobj);
//    			}
//    	};
//    	obj.buttons[buttonok] = function(){
//			var selectednode = self.network.getSelectionModel().getLastData();
//			var selectvalue = $("#selectedInvsId").val();
//			if(!selectvalue){
//				 $("#alertmsg").html("");
//				 /*$("#alertdlg").dialog({height:180});*/
//     	     	 $("#alertmsg").html(Msg.ztpz.pleaseSelectInv);                                 //选择逆变�?
//	             $("#alertdlg").dialog("open");
//	             return false;
//			}
//			if(selectednode.getClient("nodetypeid") == 44){
//				selectednode.setName($("#selectedInvsId").find("option:selected").text());
//			}
//			selectednode.setClient("topographid",selectvalue); 
//			selectednode.setClient("parentdevid",$("#selectedInvsId").find("option:selected").text()); 
//			self.updateCurTopo();
//			$( this ).dialog( "close" );
//    	}
//    	obj.buttons[buttoncancel] = function(){
//    		    $( this ).dialog( "close" );
//    	}
//    	$( "#dlgChoInvs" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
//    },
    
    /**
     * 关联设备版本
     */
    initdlgChoDevVer:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 330,
    			height:160,
    			title:Msg.topocfg.associatedevver,                                    
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
			var devverid = $("#selectedDevVer").val();
			if(!devverid){
				 $("#alertmsg").html("");
				 /*$("#alertdlg").dialog({height:180});*/
      	     	 $("#alertmsg").html(Msg.ztpz.pleaseSelectVer);                                 //请选择版本
	             $("#alertdlg").dialog("open");
	             return false;
			}
			var selectednode = self.network.getSelectionModel().getLastData();
			/*selectednode.setClient("modelVersionID", devverid);
			selectednode.setClient("modelVersionName", $("#selectedDevVer").find("option:selected").text());
			self.updateCurTopo();*/
			//是否提交校验
			var setting = new twaver.SerializationSettings();
			self.setClientPropertyType(setting);
			var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
			//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
			var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
			var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.associateDevVerOKFun(selectednode);
				self.updateCurTopo();
				$( "#dlgChoDevVer" ).dialog( "close" );
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
			$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
				if(data.success){  
					topoComon.associateDevVerOKFun(selectednode,devverid);
					self.updateCurTopo();
					$( "#dlgChoDevVer" ).dialog( "close" );
				}
				else{                
					$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
					$("#isContinueSaveTopoDatadlg").dialog("open");
				}
			},false);
			//$( this ).dialog( "close" );
    	}
    	obj.buttons[buttoncancel] = function(){
    		$( this ).dialog( "close" );
    	}
    	$( "#dlgChoDevVer" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    /**
     * 确认清除当前拓扑数据
     */
    initdlgCleanCurTopoData:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;	
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 330,
    			height:150,
    			title:Msg.topocfg.message,                                    
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
			//self.cleanCurTopoData();
    		//是否提交校验
    		var setting = new twaver.SerializationSettings();
    		self.setClientPropertyType(setting);
    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
    		var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
    		var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				self.cleanCurTopoData();
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
    			if(data.success){                 
    				self.cleanCurTopoData();
    			}
    			else{                
    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
    				$("#isContinueSaveTopoDatadlg").dialog("open");
    			}
    		},false);
			$( this ).dialog( "close" );
    	}
    	obj.buttons[buttoncancel] = function(){
    		$( this ).dialog( "close" );
    	}
    	$( "#confirmcleantopodatadlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    
    
    /**
     * 关联设备信息
     */
   initdlgRelateDevInfo:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
		var btnNo = Msg.topocfg.no;
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 330,
    			height:300,
    			title:Msg.topocfg.assdevpro,                                    
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
    		var selectedNode = self.network.getSelectionModel().getLastData();
    		var devInfoRadio = $("input[type='radio'][name='devProInfo']:checked");                //单�?
			var devInfoRadioVal = devInfoRadio.val();
			//分图
			if((self.curConfSchemaObj.schemeTypeId == 4)||(self.curConfSchemaObj.schemeTypeId == 5) ||(self.curConfSchemaObj.schemeTypeId == 9)){
				if(!devInfoRadioVal){
					 $("#alertmsg").html("");
	      	     	 $("#alertmsg").html(Msg.topocfg.plechosedevpro);                                 //请选择版本
		             $("#alertdlg").dialog("open");
		             return false;
				}
			}
			else{
				if(!devInfoRadioVal){
					 $("#alertmsg").html("");
	      	     	 $("#alertmsg").html(Msg.topocfg.plechosedevpro);                                 //请选择版本
		             $("#alertdlg").dialog("open");
		             return false;
				}
			}
			var devInfoRadioValArr = devInfoRadioVal.split("@@");
			var selectednode = self.network.getSelectionModel().getLastData();
			/*topo.Util.clearNodeClient(selectednode);
			selectednode.setClient("devProColName", devInfoRadioValArr[0]);
			selectednode.setClient("devProName", devInfoRadioValArr[1]); 
			selectednode.setClient("devProId", devInfoRadioValArr[2]); 
			if((self.curConfSchemaObj.schemeTypeId == 4)||(self.curConfSchemaObj.schemeTypeId == 5) ||(self.curConfSchemaObj.schemeTypeId == 9)){
				
			}
			else{
				selectednode.setClient("deviceid", $("#choosedevfromdb").val());
			}
			selectednode.setClient("texttype", "1");
			selectednode.setName(devInfoRadioValArr[1]);
			self.updateCurTopo();*/
			//是否提交校验
			var setting = new twaver.SerializationSettings();
			self.setClientPropertyType(setting);
			var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
			//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
			var checkConfSchemaObj = {};
    		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
			var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.assDevProOKFun(selectednode,devInfoRadioValArr,self);
				self.updateCurTopo();
				$( "#relateDevInfo" ).dialog( "close" );
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
			$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
				if(data.success){     
					topoComon.assDevProOKFun(selectednode,devInfoRadioValArr,self);
					self.updateCurTopo();
					$( "#relateDevInfo" ).dialog( "close" );
				}
				else{                
					$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
					$("#isContinueSaveTopoDatadlg").dialog("open");
				}
			},false);
			//$( this ).dialog( "close" );
    	}
    	obj.buttons[buttoncancel] = function(){
    		$( this ).dialog( "close" );
    	}
    	$( "#relateDevInfo" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
   
    
    
    
    /**
     * 新增并关联设�?
     */
    initdlgChoDev:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
   	    var btnNo = Msg.topocfg.no;
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 360,
    			height:450,
    			title:Msg.topocfg.newandassociateddev,                                      
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
    		var selectedNode = self.network.getSelectionModel().getLastData();
			var tempnodetypeid = selectedNode.getClient("nodetypeid");
			var devID = selectedNode.getClient("deviceid");
			var schemaNodeBindInfo = {}
			schemaNodeBindInfo.bindType = 1;
			schemaNodeBindInfo.parentPelID = "";
			schemaNodeBindInfo.pelID = selectedNode.getId();
			//schemaNodeBindInfo.modelVersionID = $("#modelVersionID").val();                               //设备版本id
			schemaNodeBindInfo.modelVersionName = $("#modelVersionID").find("option:selected").text();     //设备版本名称

			if(tempnodetypeid == 42) {//关联箱变
				schemaNodeBindInfo.parentDevName = $("#ascurinvstr_222").find("option:selected").text();
			}
			if(tempnodetypeid == 44) {//关联集中式逆变器
				schemaNodeBindInfo.parentDevName = $("#ascurinvs").find("option:selected").text();
			}
			
			
            schemaNodeBindInfo.schemaID = self.curConfSchemaObj.id;
			if(self.curConfSchemaObj.schemeTypeId == 3){
				schemaNodeBindInfo.subMatrixID = self.curConfSchemaObj.busiObjectId;                      //子阵
			}
			else{
				schemaNodeBindInfo.subAreaID = self.curConfSchemaObj.busiObjectId;                        //分区，汇集站
			}
			
			var dangerChars = '[\'<>,/]';
		    var charFilterReg = new RegExp(dangerChars);
			//业务编号
			var strbusi = $("#bussinessCode").val();
            if((strbusi != null) &&(strbusi != undefined) ){
            	strbusi = strbusi.replace(/(^\s*)|(\s*$)/g,"");
    		    if(charFilterReg.test(strbusi)) {
    		    	$("#alertmsg").html("");
 				    $("#alertmsg").html(Msg.equipMode.busiCodeError);
 	                $("#alertdlg").dialog("open");
 	               return false;
    		    }
            	
            }
            if((strbusi == null) || (strbusi == undefined)|| (strbusi == "")){                            
            	    $("#alertmsg").html("");
            	    /*$("#alertdlg").dialog({height:200});*/
				    $("#alertmsg").html(Msg.topocfg.busicodecheck);
	                $("#alertdlg").dialog("open");
            	return false;
            }
            else{
            	var len = strbusi.length;
            	if((!devID)&&(len < 0 || len > 12)){
            		$("#alertmsg").html("");
            		/*$("#alertdlg").dialog({height:200});*/
   				    $("#alertmsg").html(Msg.topocfg.busicodecheck);
   	                $("#alertdlg").dialog("open");
   	                return false;
            	}
            }
            schemaNodeBindInfo.businessCode = strbusi;
            
            //名称验证
            var strname = $("#name").val();
            if((strname != null) &&(strname != undefined) ){
            	strname = strname.replace(/(^\s*)|(\s*$)/g,"");
    		    if(charFilterReg.test(strname)) {
    		    	$("#alertmsg").html("");
 				    $("#alertmsg").html(Msg.equipMode.busiCodeError);
 	                $("#alertdlg").dialog("open");
 	               return false;
    		    }
            	
            }
            if((strname == null) || (strname == undefined)|| (strname == "")){                            
            	    $("#alertmsg").html("");
            	    /*$("#alertdlg").dialog({height:200});*/
				    $("#alertmsg").html(Msg.topocfg.namecheck);
	                $("#alertdlg").dialog("open");
            	return false;
            }
            else{
            	var len = strname.length;
            	if(strname &&(len < 0 || len > 32)){
            		$("#alertmsg").html("");
            		/*$("#alertdlg").dialog({height:200});*/
   				    $("#alertmsg").html(Msg.topocfg.namecheck);
   	                $("#alertdlg").dialog("open");
   	                return false;
            	}
            }
            if(App.checkEmpty(strname)){
            	 $("#alertmsg").html("");
            	 $("#alertmsg").html(Msg.ztpz.notNameTwoEmpt);
	             $("#alertdlg").dialog("open");
                return false;
            }
            schemaNodeBindInfo.name = strname;
            
            //IP有值做校验
            var strip = $("#ip").val();
        	if((strip != null) &&(strip != undefined) ){
        		strip = strip.replace(/(^\s*)|(\s*$)/g,"");
            }
        	if(!((strip == null) || (strip == undefined)|| (strip == ""))){                                  
        		/*if(!/^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/.test(strip)){*/
        		if(!/^([1-9]|[1-9]\d|1[0-1]\d|12[0-6]|12[8-9]|1[3-9]\d|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/.test(strip)){
        			$("#alertmsg").html("");
        			/*$("#alertdlg").dialog({height:200});*/
   				    $("#alertmsg").html(Msg.topocfg.ipcheck);
   	                $("#alertdlg").dialog("open");
   	                return false;
        		}
            }
        	schemaNodeBindInfo.ip = strip;
        	/*if(!(tempnodetypeid == 15)){                                        //非箱�?（数采，逆变器，电表，环境仪�?       ESN 
        		var strESN = $("#ESN").val();
                if((strESN != null) &&(strESN != undefined) ){
                	 strESN = strESN.replace(/(^\s*)|(\s*$)/g,"");
                }
        		if(strESN && !/^[a-zA-Z0-9]{1,64}$/.test(strESN)){
        			$("#alertmsg").html("");
        			$("#alertdlg").dialog({height:200});
   				    $("#alertmsg").html(Msg.topocfg.esncheck);
   	                $("#alertdlg").dialog("open");
   	                return false;	
        		}
        		schemaNodeBindInfo.ESN = strESN;
        	}*/
        	
    		var strESN = $("#ESN").val();
            if((strESN != null) &&(strESN != undefined) ){
            	 strESN = strESN.replace(/(^\s*)|(\s*$)/g,"");
            }
    		if(strESN && !/^[a-zA-Z0-9]{1,64}$/.test(strESN)){
    			$("#alertmsg").html("");
    			/*$("#alertdlg").dialog({height:200});*/
			    $("#alertmsg").html(Msg.topocfg.esncheck);
                $("#alertdlg").dialog("open");
                return false;	
    		}
    		schemaNodeBindInfo.ESN = strESN;
        	
        	
        	var kksCode = $("#kksCode").val();                                  //KKS
            if((kksCode != null) &&(kksCode != undefined) ){
            	kksCode = kksCode.replace(/(^\s*)|(\s*$)/g,"");
            }
    		if(kksCode && !/^[a-zA-Z0-9]{1,64}$/.test(kksCode)){
    			$("#alertmsg").html("");
    			/*$("#alertdlg").dialog({height:200});*/
				    $("#alertmsg").html(Msg.topocfg.kkscheck);
	                $("#alertdlg").dialog("open");
	                return false;	
    		}
    		schemaNodeBindInfo.kksCode = kksCode;
        	var strproadd = $("#secondaddress").val();                          //二级地址
     	    if((strproadd != null) &&(strproadd != undefined) ){
     	    	strproadd = strproadd.replace(/(^\s*)|(\s*$)/g,"");
            }
     	    if(strproadd) {
	                if(isNaN(strproadd)){    // 非数�?
	                    $("#alertmsg").html("");
	                    /*$("#alertdlg").dialog({height:200});*/
	                    $("#alertmsg").html(Msg.topocfg.subaddresscheck);
	                    $("#alertdlg").dialog("open");
	                    return false;
	                }
	                else{
	                   /* if(strproadd.length > 1 && strproadd[0] == 0){*/
	                	if(strproadd.length >= 1 && strproadd.indexOf(".") != -1){      //校验小数
	                        $("#alertmsg").html("");
	                        /*$("#alertdlg").dialog({height:200});*/
	                        $("#alertmsg").html(Msg.topocfg.subaddresscheck);
	                        $("#alertdlg").dialog("open");
	                        return false;
	                    }
	                    else{
	                        if(Number(strproadd) > 254 ||Number(strproadd)< 0){
	                            $("#alertmsg").html("");
	                            /*$("#alertdlg").dialog({height:200});*/
	                            $("#alertmsg").html(Msg.topocfg.subaddresscheck);
	                            $("#alertdlg").dialog("open");
	                            return false;
	                        }
	                    }
	                }
	             schemaNodeBindInfo.protocolAddress = Number($("#secondaddress").val());
            }
     	 //设备端口
     	    var devicePort = $("#devicePort").val();                          //设备端口
    	    if((devicePort != null) &&(devicePort != undefined) ){
    	    	devicePort = devicePort.replace(/(^\s*)|(\s*$)/g,"");
           }
    	    if(devicePort) {
                if(isNaN(devicePort)){    // 非数值
                    $("#alertmsg").html("");
                    $("#alertmsg").html(Msg.topocfg.portCheckErrror);
                    $("#alertdlg").dialog("open");
                    return false;
                }else{
                	if(devicePort.length >= 1 && devicePort.indexOf(".") != -1){      //校验小数
                        $("#alertmsg").html("");
                        /*$("#alertdlg").dialog({height:200});*/
                        $("#alertmsg").html(Msg.topocfg.portCheckErrror);
                        $("#alertdlg").dialog("open");
                        return false;
                    }else{
                        if(Number(devicePort) > 65535 ||Number(devicePort)< 0){
                            $("#alertmsg").html("");
                            $("#alertmsg").html(Msg.topocfg.portCheckErrror);
                            $("#alertdlg").dialog("open");
                            return false;
                        }
                    }
                }
             schemaNodeBindInfo.devicePort = Number($("#devicePort").val());
        }
    	    
    	    
    	    
     	   if(tempnodetypeid == 15){                 //箱变
     		//高压负荷开�?
               var highVSwitch = $("#highvswitch").val();
               if((highVSwitch != null) &&(highVSwitch != undefined) ){
               	   highVSwitch = highVSwitch.replace(/(^\s*)|(\s*$)/g,"");
               }
               if((highVSwitch == null) || (highVSwitch == undefined)|| (highVSwitch == "")){                            
	               	$("#alertmsg").html("");
	               	/*$("#alertdlg").dialog({height:200});*/
	   				$("#alertmsg").html(Msg.topocfg.highvswitch);
	   	            $("#alertdlg").dialog("open");
	               	return false;
               }
               else{
	               	var len = highVSwitch.length;
	               	if(len < 0 || len > 20){
	               		$("#alertmsg").html("");
	               		/*$("#alertdlg").dialog({height:200});*/
	      				$("#alertmsg").html(Msg.topocfg.highvswitch);
	      	            $("#alertdlg").dialog("open");
	      	            return false;
	               	}
               }
               schemaNodeBindInfo.highVSwitch = highVSwitch;
               
               //低压断路�?
               var lowVCircuitBreaker1 = $("#lowvcircuitbreaker1").val();
               if((lowVCircuitBreaker1 != null) &&(lowVCircuitBreaker1 != undefined) ){
               		lowVCircuitBreaker1 = lowVCircuitBreaker1.replace(/(^\s*)|(\s*$)/g,"");
               }
               if((lowVCircuitBreaker1 == null) || (lowVCircuitBreaker1 == undefined)|| (lowVCircuitBreaker1 == "")){                           
	               	$("#alertmsg").html("");
	               	/*$("#alertdlg").dialog({height:200});*/
	   				$("#alertmsg").html(Msg.topocfg.lowvcircuitbreaker1);
	   	            $("#alertdlg").dialog("open");
	               	return false;
               }
               else{
	               	var len = lowVCircuitBreaker1.length;
	               	if(len < 0 || len > 20){
	               		$("#alertmsg").html("");
	               		/*$("#alertdlg").dialog({height:200});*/
	      				$("#alertmsg").html(Msg.topocfg.lowvcircuitbreaker1);
	      	            $("#alertdlg").dialog("open");
	      	            return false;
	               	}
               }
               schemaNodeBindInfo.lowVCircuitBreaker1 = lowVCircuitBreaker1;
               //低压断路�?
               var lowVCircuitBreaker2 = $("#lowvcircuitbreaker2").val();
               if((lowVCircuitBreaker2 != null) &&(lowVCircuitBreaker2 != undefined) ){
               		lowVCircuitBreaker2 = lowVCircuitBreaker2.replace(/(^\s*)|(\s*$)/g,"");
               }
               if((lowVCircuitBreaker2 == null) || (lowVCircuitBreaker2 == undefined)|| (lowVCircuitBreaker2 == "")){                            
	               	$("#alertmsg").html("");
	               	/*$("#alertdlg").dialog({height:200});*/
	   				$("#alertmsg").html(Msg.topocfg.lowvcircuitbreaker2);
	   	            $("#alertdlg").dialog("open");
	               	return false;
               }
               else{
	               	var len = lowVCircuitBreaker2.length;
	               	if(len < 0 || len > 20){
	               		$("#alertmsg").html("");
	               		/*$("#alertdlg").dialog({height:200});*/
	      				$("#alertmsg").html(Msg.topocfg.lowvcircuitbreaker2);
	      	            $("#alertdlg").dialog("open");
	      	            return false;
	               	}
               }
               schemaNodeBindInfo.lowVCircuitBreaker2 = lowVCircuitBreaker2;
     	   }
     	   
     	   //设备版本
     	   var devvertemp = $("#modelVersionID").val();  
           if((devvertemp != null) &&(devvertemp != undefined) ){
        	   devvertemp = devvertemp.replace(/(^\s*)|(\s*$)/g,"");
           }
           if((devvertemp == null) || (devvertemp == undefined)|| (devvertemp == "")){                            
           	    $("#alertmsg").html("");
           	    /*$("#alertdlg").dialog({height:180});*/
			    $("#alertmsg").html(Msg.topocfg.devvercheck);
                $("#alertdlg").dialog("open");
	            return false;
           }
            schemaNodeBindInfo.modelVersionID = $("#modelVersionID").val();
            schemaNodeBindInfo.pelTypeID = selectedNode.getClient("nodetypeid");
            
            if(!(selectedNode.getClient("nodetypeid") == 5)){   //  数采,环境仪，电表，箱变，汇流�?
            	schemaNodeBindInfo.parentDevID = 0;
            }
            
            //var devID = selectedNode.getClient("deviceid");
            var hostnode = null;
            if (devID) {
                schemaNodeBindInfo.devID = devID;
            }
            if (selectedNode.getClient("nodetypeid") == 44) {
	            if($("#ascurinvs").val()){
	            	schemaNodeBindInfo.parentDevID = $("#ascurinvs").val();
	            } else if($("#ascurinvs").val() == ""){
					schemaNodeBindInfo.parentDevID = 0;
				}
			}
            if (devID) {
                schemaNodeBindInfo.devID = devID;
            }
            if(selectedNode.getClient("nodetypeid") == 42) {
	            if($("#ascurinvstr_222").val()){
	            	schemaNodeBindInfo.parentDevID = $("#ascurinvstr_222").val();
	            }else if($("#ascurinvstr_222").val() == ""){
	            	schemaNodeBindInfo.parentDevID = 0;
	            }
			}
	    	//加上图元所在分区，子阵等信�?
	    	 var nodeInfo = {};
	    	 nodeInfo.hostNode = hostnode;
	    	 nodeInfo.selfNode = selectedNode;
	    	 nodeInfo.signalid = "";
	    	 nodeInfo.signalname = "";
	    	 nodeInfo.signalcolname = "";
	    	 nodeInfo.signalunit = "";
	    	 var setting = new twaver.SerializationSettings();
	    	 self.setClientPropertyType(setting);
	    	 var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
	    	 //self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
	    	 var checkConfSchemaObj = {};
    		 checkConfSchemaObj.schemaData = xmlSerializer.serialize();
    		 checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
    		 checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
    		 checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
    		 checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
	    	 var objcv = {
	       				buttons:{
	    				}
	    	   		};
	   		 objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"1" ,nodeInfo,self.box,self.curConfSchemaObj);
			 };
			 objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		     };
	    	 $.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
	    	 	if(data.success){                       
	    	 		topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"1" ,nodeInfo,self.box,self.curConfSchemaObj);
	    	 	}
	    	 	else{                
	    	 		$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
	    	 		$("#isContinueSaveTopoDatadlg").dialog("open");
	    	 	}
	    	 },false);
			 //topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"1" ,nodeInfo,self.box,self.curConfSchemaObj);      
    	}
    	obj.buttons[buttoncancel] = function(){
    		    $( this ).dialog( "close" );
    	}
    	$( "#dlgChoDev" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    
    /**
     * 关联设备信号
     */
    initdlgChoAssNode:function(){
    	var self = this;
    	var buttonok = Msg.topocfg.sure;
    	var buttoncancel = Msg.topocfg.cancel;
    	var btnYes = Msg.topocfg.yes;
    	var btnNo = Msg.topocfg.no;
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 350,
    			height:400,
    			title:Msg.topocfg.associatedevsignal,                                   
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	obj.buttons[buttonok] = function(){
    		var selectednode = self.network.getSelectionModel().getLastData();
    		//是否提交校验
    		var setting = new twaver.SerializationSettings();
    		self.setClientPropertyType(setting);
    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
    		var checkConfSchemaObj = {};
	   		 checkConfSchemaObj.schemaData = xmlSerializer.serialize();
	   		 checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
	   		 checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
	   		 checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
	   		 checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
    		var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.associateDevSignalOKFun(selectednode,self);
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
    			if(data.success){                    
    				topoComon.associateDevSignalOKFun(selectednode,self);
    			}
    			else{                
    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
    				$("#isContinueSaveTopoDatadlg").dialog("open");
    			}
    		},false);
    	}
    	obj.buttons[buttoncancel] = function(){
    		    $( this ).dialog( "close" );
    	}
    	$( "#dlgChoAssNode").dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },
    
    /**
     * 消息提示
     */
    initalertdlg:function(){
    	var self = this;
    	var buttonclose = Msg.topocfg.close;
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 240,
    			/*height:180,*/
    			title:Msg.topocfg.message,                                    
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			    $(this).blur();
    			}
    	};
    	obj.buttons[buttonclose] = function(){
    		$( this ).dialog( "close" );
    	}
    	$( "#alertdlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },

	initdlgChoCalcSignal: function() {
		var self = this;
		var buttonok = Msg.topocfg.sure;
		var buttoncancel = Msg.topocfg.cancel;
		var btnYes = Msg.topocfg.yes;
    	var btnNo = Msg.topocfg.no;
		var obj = {
			position:{at:"center"},
			autoOpen: false,
			resizable:false,
			width: 340,
			height:220,
			title:Msg.topocfg.message,
			modal: true,
			buttons:{},
			close:function(){
				var optobj = $(this).dialog("option","position");
				optobj.my = "center";
				optobj.at = "center";
				$(this).dialog("option","position",optobj);
				$(this).blur();
			}
		};
		obj.buttons[buttonok] = function(){
			var selectedNode = self.network.getSelectionModel().getLastData();
			//是否提交校验
			var setting = new twaver.SerializationSettings();
			self.setClientPropertyType(setting);
			var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
			//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
			 var checkConfSchemaObj = {};
	   		 checkConfSchemaObj.schemaData = xmlSerializer.serialize();
	   		 checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
	   		 checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
	   		 checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
	   		 checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
			var objcv = {
       				buttons:{
    				}
    	   		};
	   		objcv.buttons[btnYes] = function(){
	   			$( this ).dialog( "close" );
				topoComon.associateCalcSignalOKFun(selectedNode,self);
				$("#dlgChoCalcSignal").dialog( "close" );
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
			$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
				if(data.success){     //可以直接提交                           
					topoComon.associateCalcSignalOKFun(selectedNode,self);
					$("#dlgChoCalcSignal").dialog( "close" );
				}
				else{                 //不可以直接提交
					$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
					$("#isContinueSaveTopoDatadlg").dialog("open");
				}
			},false);
			//$( this ).dialog( "close" );
		};
		obj.buttons[buttoncancel] = function(){
			$( this ).dialog( "close" );
		};
		$("#dlgChoCalcSignal").dialog(obj).prev().find (".ui-dialog-titlebar-close").hide();
	},
	
	/**
     * 当前拓扑图有人编辑，确认是否继续保存拓扑图?
     */
    initIsContinueSaveTopoDatadlg:function(){
    	var self = this;
    	/*var buttonyes = "是";
    	var buttonno = "否";*/
    	var obj = {
    			position:{at:"center"},
    			autoOpen: false,
    			resizable:false,
    			width: 310,
    			height:190,
    			title:Msg.topocfg.message,                                   
    			modal: true,
    			buttons:{},
    			close:function(){
    				var optobj = $(this).dialog("option","position");
    			    optobj.my = "center";
    			    optobj.at = "center",
    			    $(this).dialog("option","position",optobj);
    			}
    	};
    	$( "#isContinueSaveTopoDatadlg" ).dialog(obj).prev ().find (".ui-dialog-titlebar-close").hide ();
    },

    /**
     * 初始化对话框
     */
    initDialog:function(){
    	var self = this;
    	self.initchoosedevdlg();                  //关联设备
    	self.initchangepicdlg();                  //更换图片
    	self.initcomfirmsavetoppdatadlg();        //是否保存当前拓扑�?
    	self.initdlgChoTopoGraph();               //关联拓扑�?
//    	self.initAsInvDevId();                    //直流汇流箱关联逆变器id
    	self.initdlgChoDevVer();                  //关联版本
    	self.initdlgChoDev();                     //新增并关联设�?
    	self.initdlgChoAssNode();                 //关联设备信号
    	self.initalertdlg();                      //消息提示
    	self.initleavecomfirmsavetoppdatadlg();
    	self.initdlgCleanCurTopoData();           //确认是否清除当前拓扑�?
    	self.initdlgRelateDevInfo();
		self.otherEMIdevdlg();						//关联其他站
		self.initdlgChoCalcSignal();
		self.initIsContinueSaveTopoDatadlg();
    	$("#selectedNode").bind('change', function() {
    		self.devChooseChange(self.curselectnode,self.signalflag);
    	});
    	$("#calcSigSelect").bind('change', function() {
            self.calSignalChanged(self.curselectnode,self.signalflag);
        });


    	$("#picPathSel").bind('change', function() {                                                           //更换图片
    		$("#picSrc").attr("src","/module/topo/images/userimages/"+$("#picPathSel").val());
    	});
    	
    	$("#bussinessCode").bind('blur', function() {                                                          //业务编号失焦
    		 var strbusi = $("#bussinessCode").val();
             if((strbusi != null) &&(strbusi != undefined)){
            	 strbusi = strbusi.replace(/(^\s*)|(\s*$)/g,"");
             }
    		 if( (strbusi != null) &&(strbusi != undefined)&&(strbusi != "")  && $('#name').val().trim() == ""){
    			 $("#name").val(strbusi+self.curselectnode.getClient("nodetypename"));
    		 }
    	});
    	
    	$("#choosedevfromdb").bind('change', function() {                                                      //关联设备信息
    		self.chooseDevFromDBChange(self.curselectnode);
    	});
    	
    	//关联信号的时候选择分区和子阵的change事件
    	$("#choFenQu").bind('change', function() {
    		topoComon.fenQuChange(self,self.curselectnode,self.signalflag);
    	});
    	$("#choZiZhen").bind('change', function() {
    		topoComon.ziZhenChange(self,self.curselectnode,self.signalflag);
        });
    	$("#plechaosestation").bind('change', function() {
    		topoComon.getDevsByCondition(self,self.curselectnode,self.signalflag);
        });
    },
    
    
    /**
     * 隐藏，显示工具栏
     */
    changeToolBar: function(flag,type){                                       //flag: 工具栏是否隐藏显示，
    	var self = this ;
    	if(flag){
    		$("#toolbardiv").hide();                                          //工具栏隐�?
    		self.network.getView().style.border="none";
    		self.network.getView().style.overflow = "auto";
    		self.network.getView().style.background = "none";
    		
    	}
    	else{                                                                //工具栏显�?
    		if(type == "node"){                                              
    			$("#toolbardiv").show();  
    			self.network.setMovableFunction(function(element) {          
    				//return element instanceof topo.JZZuChuan;
					var e = element;
					return (!(e instanceof twaver.Link) && !((e instanceof twaver.Grid)&& !(e instanceof topo.Shelf24) && !(e instanceof topo.Shelf23) && !(e instanceof topo.Shelf22)&& !(e instanceof topo.JZZuChuan)&& !(e instanceof topo.Table)&& !(e instanceof topo.HengXian)&& !(e instanceof topo.ShuXian)&& !(e instanceof topo.GuangZiPai)  && !(e instanceof topo.StatusButton) && !(e instanceof topo.SkipButton) && !(e instanceof topo.IndexNode)) && e)
    			});
    		}
    		else{                                                            //模板节点
    			$("#toolbardiv").hide(); 
    			self.network.setMovableFunction(function(element) {          //禁止移动
    				return false;
    			});
    		}
    		this.network.getView().style.border="1px solid #09234A";
            this.network.getView().style.overflow = "auto";
            this.network.getView().style.background = "url('/images/ztpz/bg.png') 0 0 repeat";
    	}
    },
    
    
    /**
     * 清空拓扑数据
     */
	cleanCurTopoData: function () {
		var self = this;
		self.box.getSelectionModel().selectAll();
		var selectNodes = self.box.getSelectionModel().getSelection();
		var boxNodes = self.box.getDatas();
		var selectShuCaiId = null;
		var selectNiBianQiId = null;
		var hasShucai = false;
		var hasNiBiQi = false;
		var shucaiips = [];
		var emiIds = [];
		var k = 0;
		var j = 0;
		selectNodes.forEach(function (e) {                                 //当前选中节点
			var deviceid = e.getClient("deviceid");
			var nodetypeid = e.getClient("nodetypeid");
			var relationKeyId = e.getClient("relationKeyId");
			if ((deviceid != null) && (deviceid != undefined) && (deviceid != "") && (nodetypeid == 18)) {   //数采IP
				$.omcAjax("/cm/dev/information", {"devID": deviceid}, function (data) {
					if (data.success == false) {
						/*$("#alertdlg").dialog({height:180});*/
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.getdatacollectorinfofail);   //获取数据采集器信息失�?
						$('#overlay').hide();
						$('#delLoading').hide();
						$("#alertdlg").dialog("open");
						return false;
					}
					if (data.success == true) {
						if (data.data.ip) {
							shucaiips[j] = data.data.ip;
							j++;
						}
					}
				}, false);
			}
			// 含有环境监测仪的
			if (relationKeyId == undefined && nodetypeid == 21 && deviceid != undefined) {
				emiIds[k] = deviceid;
				k++;
			}
		});
		if (shucaiips.length == 0) {                                       //没有数采
			var deletenodeids = [];
			var i = 0;
			selectNodes.forEach(function (e) {
				deletenodeids[i] = e.getId();
				i++;
			});
			$.omcAjax("/cm/SchemaNodeBind/pels/hasEMIType5", {"devIds": emiIds}, function (data) {
				$('#overlay').show();
				$('#delLoading').show();
				if (!data.success) {
					$("#alertmsg").html("");
					$("#alertmsg").html(Msg.topocfg.getEMIinfofail);   //获取环境监测仪绑定信息失败
					$('#delLoading').hide();
					$('#overlay').hide();
					$("#alertdlg").dialog("open");
				}
				if (data.success && data.data) {
					$.omcAjax("/cm/SchemaNodeBind/pels/delete", {"pelIDs": deletenodeids}, function (data) {           //后端删除图元逻辑
						if (data.success == false) {
							/*$("#alertdlg").dialog({height:180});*/
							$("#alertmsg").html("");
							$("#alertmsg").html(Msg.topocfg.deletenodefail);                  //删除失败
							$('#delLoading').hide();
							$('#overlay').hide();
							$("#alertdlg").dialog("open");
							return false;
						}
						if (data.success == true) {
							if (data.data == false) {
								$('#overlay').hide();
								$('#delLoading').hide();
								App.myMsg(Msg.topocfg.siphunculus);
								return false;
							}
							self.box.clear();
							var setting = new twaver.SerializationSettings();               //更新拓扑数据�?
							self.setClientPropertyType(setting);
							var xmlSerializer = new twaver.XmlSerializer(self.box, setting);
							var ConfSchemaInfo = {};
							ConfSchemaInfo.schemaData = xmlSerializer.serialize();
							ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
							ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
							ConfSchemaInfo.id = self.curConfSchemaObj.id;
							$.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
								if (data.success == false) {
									/*$("#alertdlg").dialog({height:180});*/
									$("#alertmsg").html("");
									$("#alertmsg").html(Msg.topocfg.updatetopofail);                 //更新拓扑失败
									$('#overlay').hide();
									$('#delLoading').hide();
									$("#alertdlg").dialog("open");
								}
								else {
									/*$("#alertdlg").dialog({height:180});*/
									$("#alertmsg").html("");
									$("#alertmsg").html(Msg.topocfg.deletesuccess);                  //删除成功
									$('#overlay').hide();
									$('#delLoading').hide();
									$("#alertdlg").dialog("open");
									self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
									self.curConfSchemaObj.timeStamp = data.data.timeStamp;
								}
							});
						}
					});
				} else {
					$("#alertmsg").html("");
					$("#alertmsg").html(Msg.topocfg.deleteEMIinfofail);   //要删除的环境监测仪纯在引用
					$('#overlay').hide();
					$('#delLoading').hide();
					$("#alertdlg").dialog("open");
				}
			});
		}
		else {                                                                                   //有数采，询问后端存在有与其关联设�?
			$.omcAjax("/cm/dev/sameip", {"IPs": shucaiips}, function (data) {
				if (data.success == false) {
					/*$("#alertdlg").dialog({height:180});*/
					$("#alertmsg").html("");
					$("#alertmsg").html(Msg.topocfg.gethasassdatacollectordevfail);     //获取是否存在和当前删除数据采集器有关联的设备
					$("#alertdlg").dialog("open");
				}
				else {
					var listtemp = new twaver.List();
					for (var n = 0; n < selectNodes.size(); n++) {                        //图元建库的节�?
						var nodetypeidtemp = selectNodes.get(n).getClient("nodetypeid");
						/*if((nodetypeidtemp == 5) || (nodetypeidtemp == 18)|| (nodetypeidtemp == 15)|| (nodetypeidtemp == 16)|| (nodetypeidtemp == 39)|| (nodetypeidtemp == 21)){
						 listtemp.add(selectNodes.get(n));
						 }*/
						//防止多个数采IP一�?
						if (nodetypeidtemp && (nodetypeidtemp == 5) || (nodetypeidtemp == 15) || (nodetypeidtemp == 16) || (nodetypeidtemp == 39) || (nodetypeidtemp == 21) || (nodetypeidtemp == 48) || (nodetypeidtemp == 49) || (nodetypeidtemp == 50) || (nodetypeidtemp == 52)) {
							listtemp.add(selectNodes.get(n));
						}
					}
					var dataarr = data.data;                                          //返回的数据库的具有选中数采的IP相同的集�?
					var deleteFlay = true;
					var count = 0;
					var devnotshucai = 0;
					for (var m = 0; m < dataarr.length; m++) {                          //查询设备
						if (2 == dataarr[m].devTypeId) {                                //数采排除
							continue;
						}
						devnotshucai++;
						for (var k = 0;k < listtemp.size();k++){
							var temp = listtemp.get(k);
							if (temp.getClient("relationKeyId") == undefined && temp.getClient("deviceid") == dataarr[m].id) {     //框选设备是框选数采的下级设备
								count++;
							}
						}
					}
				}
				/* if(count == dataarr.length){
				 deleteFlay = true;
				 }
				 else{
				 deleteFlay = false;
				 }*/
				if (count == devnotshucai) {
					deleteFlay = true;
				}
				else {
					deleteFlay = false;
				}
				if (deleteFlay) {      // 可以�?
					var deletenodeids = [];
					var i = 0;
					selectNodes.forEach(function (e) {
						deletenodeids[i] = e.getId();
						i++;
					});
					$.omcAjax("/cm/SchemaNodeBind/pels/hasEMIType5", {"devIds": emiIds}, function (data) {
						if (!data.success) {
							$("#alertmsg").html("");
							$("#alertmsg").html(Msg.topocfg.getEMIinfofail);   //获取环境监测仪绑定信息失败
							$("#alertdlg").dialog("open");
						}
						if (data.success && data.data) {
							$.omcAjax("/cm/SchemaNodeBind/pels/delete", {"pelIDs": deletenodeids}, function (data) {           //后端删除图元逻辑
								if (data.success == false) {
									/*$("#alertdlg").dialog({height:180});*/
									$("#alertmsg").html("");
									$("#alertmsg").html(Msg.topocfg.deletenodefail);             //删除图元失败
									$("#alertdlg").dialog("open");
									return false;
								}
								if (data.success == true) {
									self.box.clear();
									var setting = new twaver.SerializationSettings();               //更新拓扑数据�?
									self.setClientPropertyType(setting);
									var xmlSerializer = new twaver.XmlSerializer(self.box, setting);
									var ConfSchemaInfo = {};
									ConfSchemaInfo.schemaData = xmlSerializer.serialize();
									ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
									ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
									ConfSchemaInfo.id = self.curConfSchemaObj.id;
									$.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
										if (data.success == false) {
											/*$("#alertdlg").dialog({height:180});*/
											topo.Util.failTip(data, Msg.topocfg.updatetopofail);
										}
										else {
											/*$("#alertdlg").dialog({height:180});*/
											$("#alertmsg").html("");
											$("#alertmsg").html(Msg.topocfg.deletesuccess);      //删除成功
											$("#alertdlg").dialog("open");
											self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
											self.curConfSchemaObj.timeStamp = data.data.timeStamp;
										}
									});
								}
							});
						}else{
							$("#alertmsg").html("");
							$("#alertmsg").html(Msg.topocfg.deleteEMIinfofail);   //要删除的环境监测仪纯在引用
							$("#alertdlg").dialog("open");
						}
					});
				} else {
					/*$("#alertdlg").dialog({height:200});*/
					$("#alertmsg").html("");
					$("#alertmsg").html(Msg.topocfg.deletedatacollectortip);                       //要删除的数据采集器有与其关联设备，不能删�?
					$("#alertdlg").dialog("open");
				}
			});
		}
	},
    
    /**
     * 初始化工具栏
     */
    initToolBar: function(){                                                  //保存
	   	 var self = this;
	   	 var btnYes = Msg.topocfg.yes;
    	 var btnNo = Msg.topocfg.no;
	   	 $("#saveToolButton").bind("click",function(){  
	   		/* var setting = new twaver.SerializationSettings();
	   		 self.setClientPropertyType(setting);
             var xmlSerializer = new twaver.XmlSerializer(self.box,setting);
             var ConfSchemaInfo = {};
             console.info(xmlSerializer.serialize());
       	     ConfSchemaInfo.schemaData = xmlSerializer.serialize();
       	     ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
       	     ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
       	     ConfSchemaInfo.id = self.curConfSchemaObj.id;
             $.omcAjax("/cm/ConfSchemaInfo/update",ConfSchemaInfo , function(data) {
	           	 if(data.success == false){
	           		 $("#alertdlg").dialog({height:180});
	           		 topo.Util.failTip(data,Msg.topocfg.updatetopofail); 
	           	 }
	           	 else{
	           		 self.curConfSchemaObj.schemaData = xmlSerializer.serialize(); 
	           		 $("#alertdlg").dialog({height:180});
	           		 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.savesuccess);                 //保存成功
		             $("#alertdlg").dialog("open");
	           	 }
           	});*/
	   	    //是否提交校验
	   		var setting = new twaver.SerializationSettings();
	   		self.setClientPropertyType(setting);
	   		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
	   		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
	   		var checkConfSchemaObj = {};
	   		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
	   		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
	   		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
	   		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
	   		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
	   		var objcv = {
   				buttons:{
				}
	   		};
	   		objcv.buttons[btnYes] = function(){
				$( this ).dialog( "close" );
				topoComon.toolbarSave(self);
			};
			objcv.buttons[btnNo] = function(){
				$( this ).dialog( "close" );
		    };
	   		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
	   			if(data.success){                     
	   				topoComon.toolbarSave(self);
	   			}
	   			else{                
	   				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
	   				$("#isContinueSaveTopoDatadlg").dialog("open");
	   			}
	   		},false);

	   	 });
	   	 
	   	$("#defaultToolButton").bind("click",function(){                        //缺省
	   		if (twaver.Util.isTouchable) {
                self.network.setTouchInteractions();
            } else {
                self.network.setDefaultInteractions();
            }
	   	 });
	   	
	   	$("#cleanToolButton").bind("click",function(){                        //清除
	   		$( "#confirmcleantopodatadlg" ).dialog("open");
	   	 });
	   	 
	 	$("#editToolButton").bind("click",function(){                           //编辑
	 		 self.network.setEditInteractions();
	   	 });
	 	
	 	$("#magnifyToolButton").bind("click",function(){                        //放大
	 		 self.network.zoomIn();
	   	 });
	 	
	 	$("#lessonToolButton").bind("click",function(){                         //缩小
	 		 self.network.zoomOut();
	   	 });
	 	
	 	$("#topalignToolButton").bind("click",function(){                       //上对�?
	 		self.doAlign("top"); 
	   	 });
	 	
	 	$("#bottomalignToolButton").bind("click",function(){                    //下对�?
	 		self.doAlign("bottom");
	   	 });
	 	
	 	$("#leftalignToolButton").bind("click",function(){                      //左对�?
	 		self.doAlign("left");
	   	 });
	 	
	 	$("#rightalignToolButton").bind("click",function(){                     //右对�?
	 		self.doAlign("right");
	   	 });
	 	
	 	$("#refreshToolButton").bind("click",function() {                       //刷新
	 		var idFinder = new twaver.QuickFinder(self.box,"nodetypeid","client");
			var shucainode = idFinder.find("18"); 
			var decviceid = "";
			shucainode.forEach(function(e){
				if(e.getClient("deviceid")){
					decviceid = e.getClient("deviceid");
					return;
				}
			});
            var parameters = {};
            parameters.devID = decviceid;
            //$("#refreshToolButton").attr("disabled",true);
	 		$.omcAjax("/cm/dev/refresh", parameters , function(data) {         //发送刷新的请求
	 			//$("#refreshToolButton").attr("disabled",false); 
	 			if(data.success == false){
	           		 /*$("#alertdlg").dialog({height:180});*/
	           		 $("#alertmsg").html("");                                //刷新失败
    				 $("#alertmsg").html(Msg.topocfg.refreshfail);
		             $("#alertdlg").dialog("open");
	           	 }
	           	 else{
	           		 
	           	 }
	       });
	   	 });
	 	
	 	
	 	$("#picUpLoadBtn").bind("click",function(){                            //上传
	 		self.uploadUserPic();
	   	 });
	 	
	   	self.network.setDefaultInteractions();                                 //默认模式
    },
    
    uploadUserPic :function(){                                                 //上传图片
    	var input_text = $("#input_text").val();
    	if(!input_text){
    		/*$("#alertdlg").dialog({height:180});*/
    		$("#alertmsg").html("");
			$("#alertmsg").html(Msg.topocfg.nochosepicfile);                                             //没有选择图片文件
            $("#alertdlg").dialog("open");
    	}
    	var namepostfix = input_text.substring(input_text.lastIndexOf(".")+1,input_text.length);
    	if((namepostfix == "png") || (namepostfix == "PNG") || (namepostfix == "gif") || (namepostfix == "GIF") 
    			|| (namepostfix == "bmp")|| (namepostfix == "BMP") || (namepostfix == "jpeg")|| (namepostfix == "JPEG") || (namepostfix == "jpg")|| (namepostfix == "JPG")){
    		$("#picForm").submit();
    	}	
    	else{
    		/*$("#alertdlg").dialog({height:200});*/
    		$("#alertmsg").html("");
			$("#alertmsg").html(Msg.topocfg.pleuploadpicfmtfile);              //请上传图片格式的文件
            $("#alertdlg").dialog("open");
    	}
    },
    
    
    doAlign: function (type) {
        var nodes = this.network.getSelectionModel().getSelection().toArray();
        demo.Util.align(nodes, type);
    },
    
    
    doEvenSpace: function (isHorizontal) {
        var nodes = this.network.getSelectionModel().getSelection().toArray();
        demo.Util.evenSpace(nodes, isHorizontal);
    },
    
    registImages: function () {
    	this.registerImage("/module/topo/images/toponodeicon/circle.png");	
    	this.registerImage("/module/topo/images/toponodeicon/sanxiang.png");
    	this.registerImage("/module/topo/images/toponodeicon/sanxiangr.png");
    	this.registerImage("/module/topo/images/toponodeicon/zizhen.png");
    	this.registerImage("/module/topo/images/toponodeicon/zizhenr.png");
    	this.registerImage("/module/topo/images/toponodeicon/guangzipai.png");
    	this.registerImage("/module/topo/images/toponodeicon/jiaoliuhuiliuxiang.png");
    	this.registerImage("/module/topo/images/toponodeicon/jiaoliuhuiliuxiangr.png");
		this.registerImage("/module/topo/images/toponodeicon/xiangbian.png");
		this.registerImage("/module/topo/images/toponodeicon/xiangbianr.png");
    	this.registerImage("/module/topo/images/toponodeicon/nibianqizc.png");
    	this.registerImage("/module/topo/images/toponodeicon/nibianqiyc.png");
    	this.registerImage("/module/topo/images/toponodeicon/nibianqizcr.png");
    	this.registerImage("/module/topo/images/toponodeicon/shujucaijiqi.png");
    	this.registerImage("/module/topo/images/toponodeicon/shujucaijiqir.png");
    	this.registerImage("/module/topo/images/toponodeicon/busNode.png");
    	this.registerImage("/module/topo/images/toponodeicon/text_icon.png");
    	this.registerImage("/module/topo/images/toponodeicon/zuchuanlan.png");
    	this.registerImage("/module/topo/images/toponodeicon/zuchuanhong.png");
    	this.registerImage("/module/topo/images/toponodeicon/zuchuan23r.png");
    	this.registerImage("/module/topo/images/toponodeicon/zuchuan22r.png");
    	this.registerImage("/module/topo/images/toponodeicon/table.png");
    	this.registerImage("/module/topo/images/toponodeicon/nibianqi3d.png");
    	this.registerImage("/module/topo/images/toponodeicon/zuchuan3dr.png");   
    	this.registerImage("/module/topo/images/toponodeicon/jiaoliuhuiliuxiang3dr.png");
    	this.registerImage("/module/topo/images/toponodeicon/huanjingyir.png");
    	this.registerImage("/module/topo/images/toponodeicon/sanxiang3dr.png");
    	this.registerImage("/module/topo/images/toponodeicon/duanluqi3dr.png");
    	this.registerImage("/module/topo/images/toponodeicon/ptr.png");
    	this.registerImage("/module/topo/images/toponodeicon/imagenoder.png");
    	this.registerImage("/module/topo/images/toponodeicon/jiedikaiguanzuor.png");
    	this.registerImage("/module/topo/images/toponodeicon/jiedikaiguanyour.png");
    	this.registerImage("/module/topo/images/toponodeicon/gelidaozhashangr.png");
    	this.registerImage("/module/topo/images/toponodeicon/gelidaozhaxiar.png");
    	this.registerImage("/module/topo/images/toponodeicon/duanluqir.png");
    	this.registerImage("/module/topo/images/toponodeicon/dixianyour.png");
    	this.registerImage("/module/topo/images/toponodeicon/dixianzuor.png");
    	this.registerImage("/module/topo/images/toponodeicon/shangjiantour.png");
    	this.registerImage("/module/topo/images/toponodeicon/xiajiantour.png");
    	this.registerImage("/module/topo/images/toponodeicon/dianbiaor.png");
    	this.registerImage("/module/topo/images/toponodeicon/gk_dianbiaor.png");
    	this.registerImage("/module/topo/images/toponodeicon/hjz_dianbiaor.png");
    	this.registerImage("/module/topo/images/toponodeicon/cyd_factorydianbiaor.png");
    	this.registerImage("/module/topo/images/toponodeicon/cyd_factorynondianbiaor.png");
    	this.registerImage("/module/topo/images/toponodeicon/nibianqikaiguanr.png");
    	this.registerImage("/module/topo/images/toponodeicon/zizhenxjr.png");
    	this.registerImage("/module/topo/images/toponodeicon/liangxiangljr.png");
    	this.registerImage("/module/topo/images/toponodeicon/liangxiangsjr.png");
    	this.registerImage("/module/topo/images/toponodeicon/liangxiang3dljr.png");
    	this.registerImage("/module/topo/images/toponodeicon/liangxiang3dsjr.png");
    	this.registerImage("/module/topo/images/toponodeicon/duanluqizjxr.png");
    	this.registerImage("/module/topo/images/toponodeicon/toumingpic.png");
    	this.registerImage("/module/topo/images/toponodeicon/zlHLX.png");
    	this.registerImage("/module/topo/images/toponodeicon/zlHLXr.png");
    	this.registerImage("/module/topo/images/toponodeicon/newzlHLXrgreen.png");
    	this.registerImage("/module/topo/images/toponodeicon/newzlHLXred.png");
    	this.registerImage("/module/topo/images/toponodeicon/3d-zlHLX.png");
    	this.registerImage("/module/topo/images/toponodeicon/3d-zlHLXr.png");
    	this.registerImage("/module/topo/images/toponodeicon/3d-zlHLXrgreen.png");
    	this.registerImage("/module/topo/images/toponodeicon/3d-zlHLXrred.png");
    	this.registerImage("/module/topo/images/toponodeicon/jzNBQ3D.png");
    	this.registerImage("/module/topo/images/toponodeicon/jzNBQ-left.png");
    	this.registerImage("/module/topo/images/toponodeicon/jzNBQ-right.png");
    	this.registerImage("/module/topo/images/toponodeicon/jzZuChuan.png");
    	this.registerImage("/module/topo/images/toponodeicon/xiangbian3D.png");
    	this.registerImage("/module/topo/images/toponodeicon/powerRegulation.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljft1.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt1.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljft2.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt2.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt3.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljft3.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt4.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljft4.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjzt1.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjft1.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjzt2.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjft2.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjzt3.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjft3.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjzt4.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjft4.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjzt5.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbsjft5.png");
    	this.registerImage("/module/topo/images/toponodeicon/tgjr.png");
    	this.registerImage("/module/topo/images/toponodeicon/tgjd.png");
    	this.registerImage("/module/topo/images/toponodeicon/tgjerror.png");
    	this.registerImage("/module/topo/images/toponodeicon/indexnode.png");
    	this.registerImage("/module/topo/images/toponodeicon/bileizhenr.png");
    	this.registerImage("/module/topo/images/toponodeicon/daidianzzr.png");
    	this.registerImage("/module/topo/images/toponodeicon/dianrongr.png");
    	this.registerImage("/module/topo/images/toponodeicon/diankangr.png");
    	this.registerImage("/module/topo/images/toponodeicon/fldiankangr.png");
    	this.registerImage("/module/topo/images/toponodeicon/dianganr.png");
    	this.registerImage("/module/topo/images/toponodeicon/shoucher.png");
    	this.registerImage("/module/topo/images/toponodeicon/yuankongr.png");
    	
    	this.registerImage("/module/topo/images/toponodeicon/shouchemr.png");
    	this.registerImage("/module/topo/images/toponodeicon/shoucheyc.png");
    	this.registerImage("/module/topo/images/toponodeicon/yuankongmr.png");
    	this.registerImage("/module/topo/images/toponodeicon/yuankongyc.png");
    	
    	this.registerImage("/module/topo/images/toponodeicon/pidTopoImg.png");
    	this.registerImage("/module/topo/images/toponodeicon/pidTopoImg3D.png");
    	this.registerImage("/module/topo/images/toponodeicon/zuchuan24r.png");
    	this.registerImage("/module/topo/images/toponodeicon/tongyong.png");//注册通用节点的图片
    },
    
    
    registerImage: function (url) {                                                
        demo.Util.registerImage(url, this.network);
    },
    
    /**
     * 增加link
     */
    addLinkButton: function (src) {                                                
        var imageName = demo.Util.getImageName(src);
        var button = document.createElement('input');
        button.setAttribute('type', 'image');
        //button.setAttribute('title', imageName);
        button.style.padding = '3px 3px 3px 3px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.setAttribute('src', src);
        var self = this;
        button.addEventListener('click', function () {
            self.network.setCreateLinkInteractions(function (fromNode, toNode) {
            	var link = new Link();
                link.setStyle('link.type', imageName);
                link.setStyle('link.corner', "none");
                link.setStyle('link.color', "#ffcc00");
                link.setStyle('link.from.at.edge', true);
                link.setStyle('link.to.at.edge', true);
                link.setStyle('link.width', 1);
                link.setStyle('link.from.xoffset', 0);
                link.setStyle('link.from.yoffset', 0);
                link.setStyle('link.to.xoffset', 0);
                link.setStyle('link.to.yoffset', 0);
                link.setStyle('link.extend', 5);
                link.setFromNode(fromNode);
                link.setToNode(toNode);
                return link;
            });
        }, false);
        this.graphsDiv.appendChild(button);
        return button;
    },
    
    
    /**
     * 增加link
     */
    addLinkButton1: function (div, title, src, classname) {
    	var imageName = demo.Util.getImageName(src);
        var button = document.createElement('input');
        button.setAttribute('type', 'image');
        //button.setAttribute('title', title);
        button.style.padding = '4px 4px 4px 4px';
        button.style.width = '40px';
        button.style.height = '40px';
        button.setAttribute('src', src);
        var self = this;
        if(classname == "Link"){
	        button.addEventListener('click', function () {
	            self.network.setCreateLinkInteractions(function (fromNode, toNode) {
	                var link = twaver.Util.newInstance(classname);
	                link.setStyle('link.color', "#ffcc00");
	                link.setStyle('link.width', 1);
	                link.setStyle('link.corner', "none");
	                link.setStyle('link.from.at.edge', true);
	                link.setStyle('link.to.at.edge', true);
	                link.setStyle('link.from.xoffset', 0);
	                link.setStyle('link.from.yoffset', 0);
	                link.setStyle('link.to.xoffset', 0);
	                link.setStyle('link.to.yoffset', 0);
	                link.setStyle('link.extend', 5);
	                link.setFromNode(fromNode);
	                link.setToNode(toNode);
	                return link;
	            });
	        }, false);
        }
        else{
        	 button.addEventListener('click', function () {
        		 self.network.setCreateShapeLinkInteractions(twaver.ShapeLink);
 	        }, false);
        }
        div.appendChild(button);
        return button;
    },
    
    /**
     * 初始化TAB
     */
    initTabs: function () {
    	var self = this;
        //设备类
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.nibianqi, 'nibianqizc', 'topo.NiBianQi',Msg.topocfg.nibianqi,"5");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.nibianqi3d, 'nibianqizc', 'topo.NiBianQi3D',Msg.topocfg.nibianqi3d,"5");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.xiangbian, 'xiangbian', 'topo.XiangBian', Msg.topocfg.xiangbian,"15");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.jizhongxiangbian3d, 'xiangbian', 'topo.JZXiangBian3D',Msg.topocfg.jizhongxiangbian3d,"47");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.huiliuxiang, 'jiaoliuhuiliuxiang', 'topo.JLHuiLiuXiang',Msg.topocfg.huiliuxiang,"16");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.huiliuxiang3d, 'jiaoliuhuiliuxiang', 'topo.JLHuiLiuXiang3D',Msg.topocfg.huiliuxiang3d,"25");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.dianbiao, 'dianbiaor', 'topo.DianBiao',Msg.topocfg.dianbiao,"39");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.gkdianbiao, 'gk_dianbiaor', 'topo.gkDianBiao',Msg.topocfg.gkdianbiao,"48");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.hjzdianbiao, 'hjz_dianbiaor', 'topo.hjzDianBiao',Msg.topocfg.hjzdianbiao,"49");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.cydfactorydianbiao, 'cyd_factorydianbiaor', 'topo.cydFactoryDianBiao',Msg.topocfg.cydfactorydianbiao,"50");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.cydfactorynondianbiao, 'cyd_factorynondianbiaor', 'topo.cydFactoryNonDianBiao',Msg.topocfg.cydfactorynondianbiao,"52");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.jizhongnibianqi, 'jzNBQ-right', 'topo.JZNiBianQi',Msg.topocfg.jizhongnibianqi,"42");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.jznibianqi3d, 'jzNBQ3D', 'topo.JZNiBianQi3D',Msg.topocfg.jznibianqi3d,"41");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zhiliuhuiliuxiang, 'zlHLX', 'topo.ZLHuiLiuXiang',Msg.topocfg.zhiliuhuiliuxiang,"44");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zhiliuhuiliuxiang3d, '3d-zlHLX', 'topo.ZLHuiLiuXiang3D',Msg.topocfg.zhiliuhuiliuxiang3d,"45");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.pidTopo, 'pidTopoImg', 'topo.pidTopo',Msg.topocfg.pidTopo,"56");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.pidTopo3D, 'pidTopoImg3D', 'topo.pidTopo3D',Msg.topocfg.pidTopo3D,"57");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.datacollector, 'shujucaijiqi', 'topo.ShuJuCaiJiQi',Msg.topocfg.datacollector,"18");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.huanjingyi, 'huanjingyi', 'topo.HuJingJianCeYi',Msg.topocfg.huanjingyi,"21");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.tgj, 'tgj', 'topo.TGJ',Msg.topocfg.tgj,"54");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.powerRegulation, 'powerRegulation', 'topo.PowerRegulation',Msg.topocfg.powerRegulation,"53");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.tongyong, 'tongyong', 'topo.TongYong',Msg.topocfg.tongyong,"69");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.indexnode, 'indexnode', 'topo.IndexNode',Msg.topocfg.indexnode,"55");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.circleChart, 'circle', 'topo.circleChart',Msg.topocfg.circleChart,"66");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.picnode, 'imagenode', 'topo.ImageNode',Msg.topocfg.picnode,"30");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.tablenode, 'table', 'topo.Table',Msg.topocfg.tablenode,"19");
        
        //组串
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zuchuan22, 'zuchuan22', 'topo.Shelf22',Msg.topocfg.zuchuan22,"8");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zuchuan23, 'zuchuan23', 'topo.Shelf23',Msg.topocfg.zuchuan23,"6"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zuchuan24, 'zuchuan24', 'topo.Shelf24',Msg.topocfg.zuchuan24,"67");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.jizhongzuchuan, 'jzZuChuan', 'topo.JZZuChuan',Msg.topocfg.jizhongzuchuan,"46");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zuchuan3d, 'zuchuan3d', 'topo.ZuChuan3D',Msg.topocfg.zuchuan3d,"20");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zizheng, 'zizhen', 'topo.ZiZhen',Msg.topocfg.zizheng,"4");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.zizheng, 'zizhenxj', 'topo.ZiZhenXJ',Msg.topocfg.zizheng,"4");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.skipbutton, 'skipbutton', 'topo.SkipButton',Msg.topocfg.skipbutton,"28");
		demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.statusButton, 'StatusButton', 'topo.StatusButton',Msg.topocfg.statusButton,"68");

        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.guangzipai, 'guangzipai', 'topo.GuangZiPai',Msg.topocfg.guangzipai,"14");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.statictext, 'text_icon', 'topo.Text',Msg.topocfg.statictext,"7");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.nibianqikaiguan, 'nibianqikaiguan', 'topo.NiBianQiKaiGuan',Msg.topocfg.nibianqikaiguan,"40");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.duanluqi, 'duanluqi', 'topo.DuanLuQi',Msg.topocfg.duanluqi,"9");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.duanluqizjx, 'duanluqizjx', 'topo.DuanLuQiZJX',Msg.topocfg.duanluqizjx,"9");                //断路器，主接�?
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.duanluqi3d, 'duanluqi3d', 'topo.DuanLuQi3D',Msg.topocfg.duanluqi3d,"27");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.daozha, 'jiedikaiguanzuo', 'topo.JieDiKaiGuanZuo',Msg.topocfg.daozha,"31");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.subline, 'dixianyou', 'topo.DiXianYou',Msg.topocfg.subline,"36");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.bileizhen, 'bileizhen', 'topo.BiLeiZhen',Msg.topocfg.bileizhen,"58");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.daidianzz, 'daidianzz', 'topo.DaiDianZZ',Msg.topocfg.daidianzz,"59");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.dianrong, 'dianrong', 'topo.DianRong',Msg.topocfg.dianrong,"60");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.diankang, 'diankang', 'topo.DianKang',Msg.topocfg.diankang,"61");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.fldiankang, 'fldiankang', 'topo.FLDianKang',Msg.topocfg.fldiankang,"62");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.diangan, 'diangan', 'topo.DianGan',Msg.topocfg.diangan,"63");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.shouche, 'shouche', 'topo.ShouChe',Msg.topocfg.shouche,"64");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.yuankong, 'yuankong', 'topo.YuanKong',Msg.topocfg.yuankong,"65");
        
        
        //线条类
        this.addLinkButton('/module/topo/images/topolinkicon/flexional.png');        
        this.addLinkButton('/module/topo/images/topolinkicon/orthogonal.png');
        this.addLinkButton('/module/topo/images/topolinkicon/extend.top.png');
        this.addLinkButton('/module/topo/images/topolinkicon/extend.left.png');
        this.addLinkButton('/module/topo/images/topolinkicon/extend.bottom.png');
        this.addLinkButton('/module/topo/images/topolinkicon/extend.right.png');
        this.addLinkButton('/module/topo/images/topolinkicon/orthogonal.H.V.png');
        this.addLinkButton('/module/topo/images/topolinkicon/orthogonal.V.H.png');
        this.addLinkButton1(this.graphsDiv, Msg.topocfg.zhixian, '/module/topo/images/toponodeicon/zhixian.png','Link');
        demo.Util.addButton(this.graphsDiv, '不规则节点', '/module/topo/images/toponodeicon/shapenode_icon.png', function () {
        	if(self.treenodetype == "node" && self.parentTreeNodeId != 0 ){
        		self.network.getSelectionModel().clearSelection();
        		self.network.setCreateShapeNodeInteractions(topo.ShapeNode);
        	}
        	else{
        		self.network.setDefaultInteractions();
        	}
        });
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.hengxian, 'hengxian', 'topo.HengXian',Msg.topocfg.hengxian,"17");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.shuxian, 'shuxian', 'topo.ShuXian',Msg.topocfg.shuxian,"17");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.jiantou, 'shangjiantou', 'topo.ShangJianTou',Msg.topocfg.jiantou,"37");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.ptnode, 'pt', 'topo.PT',Msg.topocfg.ptnode,"29");
        
        //两相，三相
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang, 'xblj2', 'topo.LiangXiangLJ',Msg.topocfg.liangxiang,"13");              
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang3d, 'xblj2', 'topo.LiangXiang3DLJ',Msg.topocfg.liangxiang3d,"13");       
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang, 'xblj1', 'topo.LiangXiangSJ',Msg.topocfg.liangxiang,"13");             
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang3d, 'xblj1', 'topo.LiangXiang3DSJ',Msg.topocfg.liangxiang3d,"13");      
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang, 'xblj3', 'topo.XBLJZT3',Msg.topocfg.liangxiang,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang3d, 'xblj3', 'topo.XBLJFT3',Msg.topocfg.liangxiang3d,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang, 'xblj4', 'topo.XBLJZT4',Msg.topocfg.liangxiang,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.liangxiang3d, 'xblj4', 'topo.XBLJFT4',Msg.topocfg.liangxiang3d,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang, 'xbsj1', 'topo.SanXiang',Msg.topocfg.sanxiang,"13");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang3d, 'xbsj1', 'topo.SanXiang3D',Msg.topocfg.sanxiang3d,"13");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang, 'xbsj2', 'topo.XBSJZT2',Msg.topocfg.sanxiang,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang3d, 'xbsj2', 'topo.XBSJFT2',Msg.topocfg.sanxiang3d,"13");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang, 'xbsj3', 'topo.XBSJZT3',Msg.topocfg.sanxiang,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang3d, 'xbsj3', 'topo.XBSJFT3',Msg.topocfg.sanxiang3d,"13");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang, 'xbsj4', 'topo.XBSJZT4',Msg.topocfg.sanxiang,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang3d, 'xbsj4', 'topo.XBSJFT4',Msg.topocfg.sanxiang3d,"13");
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang, 'xbsj5', 'topo.XBSJZT5',Msg.topocfg.sanxiang,"13"); 
        demo.Util.addDraggableButton(this.graphsDiv, Msg.topocfg.sanxiang3d, 'xbsj5', 'topo.XBSJFT5',Msg.topocfg.sanxiang3d,"13");

    },
    /**
     * 初始化属性表�?
     * **/
    initSheet: function () {                                                                                   //初始化属性表�?
        var self = this;
    	this.sheet.setVisibleFunction(function (property) {
            var propertyTpe = property.getPropertyType();
            var propertyname = property.getPropertyName();
            if(this.getDataBox().getSelectionModel().getSelection().size() > 1){
            	return false;
            }
            var selectobj = this.getDataBox().getSelectionModel().getLastData();
            if(46 == selectobj.getClient("nodetypeid") &&  ("nodetypename"!=propertyname)
            	&& "grid.row.count"!=propertyname && "grid.column.count"!=propertyname ){
           	  return false;
           }            
            if(self.treenodetype == "node"){                                                                   //正常节点
              if(propertyname == "name"){                                         //名称除线以外都可�?
         	    	 var nodetypeid = selectobj.getClient("nodetypeid");          //逆变器，数采，三相（两相），箱变，电表，环境仪，汇流�?
         	    	 if(nodetypeid && (nodetypeid == 54) || (nodetypeid == 5) || (nodetypeid == 18) ||(nodetypeid == 13) ||(nodetypeid == 15) ||(nodetypeid == 16) ||(nodetypeid == 21) ||(nodetypeid == 39)||(nodetypeid == 41)||(nodetypeid == 42)||(nodetypeid == 44)||(nodetypeid == 45)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 56)){
         	    		 var image = selectobj.getImage();
         	    		 if(topo.Util.isShowName(image) || (image == "nibianqi3d")|| (image == "jzNBQ3D")|| (image == "3d-zlHLX") || (image == "pidTopoImg3D")){
         	    			property.setEditable(true); 
         	    			return true;
         	    		 }
         	    		 else{
         	    			return false; 
         	    		 }
         	    	 }
         	    	 else{
						 if(nodetypeid && (nodetypeid == 51)) {
							 property.setEditable(false);
						 } else {
							 property.setEditable(true);
						 }
         	    		 return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table)) && (!(selectobj instanceof topo.JZZuChuan)) ;
         	    	 }
         	  }
              if((propertyname == "width") || (propertyname == "height")){       //仅对横线竖线有效    
		           	property.setEditable(true); 
		           	return ((selectobj instanceof topo.HengXian) || (selectobj instanceof topo.ShuXian));
        	  }
              if(propertyTpe === 'style') {
					property.setEditable(true);
					var propertyName = property.getPropertyName();
					if(propertyName.indexOf('label') == 0) {                   //标签相关的属性都显示
						if(propertyName == "label.xoffset" || propertyName == "label.yoffset"){
						
							return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table)) 
							&& (!(selectobj instanceof topo.Text)) && (!(selectobj instanceof topo.circleChart)) ;
						}
						else{
							if(propertyName == "label.position"){
								return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table)) && (!(selectobj instanceof topo.circleChart));
							}
							return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table)) ;
						}
					} 
					if(propertyName.indexOf('link') == 0) {                    //线条相关的属�?
						return selectobj instanceof Link;
					} 
					if(propertyName.indexOf('grid') == 0 ){
						return selectobj instanceof topo.Table || selectobj instanceof topo.JZZuChuan;                //表格
					}
					if(propertyName == 'vector.outline.color'){
	                  	return (selectobj instanceof topo.SkipButton) || (selectobj instanceof topo.GuangZiPai) || (selectobj instanceof topo.ShapeNode)|| (selectobj instanceof topo.StatusButton)  ;             
	                }
                    if(propertyName == 'vector.fill.color'){
	                  	return  (selectobj instanceof topo.StatusButton || selectobj instanceof topo.SkipButton  || selectobj instanceof topo.HengXian || selectobj instanceof topo.ShuXian ||selectobj instanceof topo.GuangZiPai || (selectobj instanceof topo.ShapeNode));             
	                }
				    if(propertyName == 'vector.shape'){
						//填充图形  || selectobj instanceof topo.StatusButton
						return (selectobj instanceof topo.SkipButton|| selectobj instanceof topo.StatusButton  || selectobj instanceof topo.HengXian || selectobj instanceof topo.ShuXian ||selectobj instanceof topo.GuangZiPai);
					}
				    if(propertyName == 'component.height' || propertyName == 'component.width'  ||propertyName=='component.fillcolor' || propertyName == "circleChart.color" ) {                    //曲线图属性
						return selectobj instanceof topo.circleChart;
					} 
              }
              if(propertyTpe === 'client') {                                   //客户属�?
            	  property.setEditable(false);
					var propertyName = property.getPropertyName();
					if((propertyName == "highvswitch") || (propertyName == "lowvcircuitbreaker1") ||(propertyName == "lowvcircuitbreaker2")){
	                	  return (selectobj instanceof topo.XiangBian);       //箱变
	                  }
	                  else if ((propertyName == "devicename")){ 
	                	  return ((selectobj instanceof topo.XiangBian) || (selectobj instanceof topo.NiBianQi) || (selectobj instanceof topo.ShuJuCaiJiQi)|| (selectobj instanceof topo.TGJ)
	                			  || (selectobj instanceof topo.DianBiao) || (selectobj instanceof topo.gkDianBiao) || (selectobj instanceof topo.hjzDianBiao) || (selectobj instanceof topo.cydFactoryDianBiao)|| (selectobj instanceof topo.cydFactoryNonDianBiao)
	                			  || (selectobj instanceof topo.HuJingJianCeYi) || (selectobj instanceof topo.JLHuiLiuXiang)
	                			  //|| (selectobj instanceof topo.SanXiang) || (selectobj instanceof topo.LiangXiangLJ) || (selectobj instanceof topo.LiangXiangSJ)
	                			  ||topo.Util.isShowDevName(selectobj)
	                			  || (selectobj instanceof topo.Text) || (selectobj instanceof topo.DuanLuQi) || (selectobj instanceof topo.DuanLuQiZJX)
	                			  || (selectobj instanceof topo.JieDiKaiGuanZuo) || (selectobj instanceof topo.GuangZiPai) || (selectobj instanceof topo.Shelf23)|| (selectobj instanceof topo.Shelf24)
	                			  || (selectobj instanceof topo.Shelf22)|| (selectobj instanceof topo.ZLHuiLiuXiang)|| (selectobj instanceof topo.JZNiBianQi)|| (selectobj instanceof topo.JZZuChuan)
	                			  || (selectobj instanceof topo.pidTopo) || (selectobj instanceof topo.ShouChe)|| (selectobj instanceof topo.YuanKong) || (selectobj instanceof topo.StatusButton) || (selectobj instanceof topo.circleChart)
	                			  || (selectobj instanceof topo.TongYong));
	                  }
	                  else if ((propertyName == "ip") ||(propertyName == "secondaddress")||(propertyName == "kksCode") ||(propertyName == "ESN") ||(propertyName == "devicePort")){ 
	                	  return ((selectobj instanceof topo.XiangBian) || (selectobj instanceof topo.NiBianQi) || (selectobj instanceof topo.ShuJuCaiJiQi) || (selectobj instanceof topo.TGJ)
	                			  || (selectobj instanceof topo.DianBiao) || (selectobj instanceof topo.gkDianBiao) || (selectobj instanceof topo.hjzDianBiao) || (selectobj instanceof topo.cydFactoryDianBiao)|| (selectobj instanceof topo.cydFactoryNonDianBiao) 
	                			  || (selectobj instanceof topo.HuJingJianCeYi) || (selectobj instanceof topo.JLHuiLiuXiang)|| (selectobj instanceof topo.ZLHuiLiuXiang)|| (selectobj instanceof topo.JZNiBianQi) || (selectobj instanceof topo.pidTopo)
	                			  || (selectobj instanceof topo.TongYong));
	                  }
	                  else if ((propertyName == "modelVersionName")){
	                	  return ((selectobj instanceof topo.XiangBian) || (selectobj instanceof topo.NiBianQi) || (selectobj instanceof topo.ShuJuCaiJiQi)|| (selectobj instanceof topo.TGJ)
	                			  || (selectobj instanceof topo.DianBiao) || (selectobj instanceof topo.gkDianBiao) || (selectobj instanceof topo.hjzDianBiao) || (selectobj instanceof topo.cydFactoryDianBiao)|| (selectobj instanceof topo.cydFactoryNonDianBiao) || (selectobj instanceof topo.HuJingJianCeYi) || (selectobj instanceof topo.JLHuiLiuXiang)
	                			  || (selectobj instanceof topo.NiBianQi3D)
	                			  //|| (selectobj instanceof topo.SanXiang3D)|| (selectobj instanceof topo.LiangXiang3DLJ)
	                			  //|| (selectobj instanceof topo.LiangXiang3DSJ)|| (selectobj instanceof topo.SanXiang) || (selectobj instanceof topo.LiangXiangLJ) 
	                			  //|| (selectobj instanceof topo.LiangXiangSJ)
	                			  ||topo.Util.isShowDevVerName(selectobj)
	                			  || (selectobj instanceof topo.JZNiBianQi3D)|| (selectobj instanceof topo.ZLHuiLiuXiang)|| (selectobj instanceof topo.ZLHuiLiuXiang3D) || (selectobj instanceof topo.JZNiBianQi)||(selectobj instanceof topo.pidTopo) || (selectobj instanceof topo.pidTopo3D))
	                  }
	                  else if ((propertyName == "topographname")){
	                	  return ((selectobj instanceof topo.ZiZhen)|| (selectobj instanceof topo.ZiZhenXJ) ||   (selectobj instanceof topo.StatusButton)|| (selectobj instanceof topo.SkipButton) || (selectobj instanceof topo.IndexNode) || (selectobj instanceof topo.ShapeNode));       //子阵，跳转按�?
	                  }
	                  else if ((propertyName == "signalname")){
	                	  return ((selectobj instanceof topo.Text)|| (selectobj instanceof topo.GuangZiPai) || (selectobj instanceof topo.DuanLuQi)
	                			  || (selectobj instanceof topo.DuanLuQiZJX)|| (selectobj instanceof topo.DuanLuQi3D)|| (selectobj instanceof topo.JieDiKaiGuanZuo)
	                			  || (selectobj instanceof topo.NiBianQiKaiGuan)|| (selectobj instanceof topo.Shelf23)|| (selectobj instanceof topo.Shelf22)|| (selectobj instanceof topo.Shelf24)|| (selectobj instanceof topo.JZZuChuan)
	                			  || (selectobj instanceof topo.ShouChe)|| (selectobj instanceof topo.YuanKong) || (selectobj instanceof topo.circleChart) || (selectobj instanceof topo.StatusButton));      
	                  }
	                  else if ((propertyName == "yksignalname")){
	                	  /*return ((selectobj instanceof topo.DuanLuQi)|| (selectobj instanceof topo.DuanLuQiZJX));*/
	                	  return false;
	                  }
	                  else if ((propertyName == "ykkqsignalname")){
	                	  return ((selectobj instanceof topo.NiBianQiKaiGuan) || (selectobj instanceof topo.DuanLuQi3D) 
	                			  || (selectobj instanceof topo.DuanLuQi) || (selectobj instanceof topo.DuanLuQiZJX)
	                			  || (selectobj instanceof topo.JieDiKaiGuanZuo)|| (selectobj instanceof topo.ShouChe));
	                  }
	                  else if ((propertyName == "ykgbsignalname")){
	                	  return ((selectobj instanceof topo.NiBianQiKaiGuan) || (selectobj instanceof topo.DuanLuQi3D)
	                			  || (selectobj instanceof topo.DuanLuQi) || (selectobj instanceof topo.DuanLuQiZJX)
	                			  || (selectobj instanceof topo.JieDiKaiGuanZuo) || (selectobj instanceof topo.ShouChe));
	                  }
	                  else if((propertyName == "parentdevName")){
	                	  return ((selectobj instanceof topo.ZLHuiLiuXiang) || (selectobj instanceof topo.JZNiBianQi));
	                  }
	                  else if((propertyName == "devProColName") || (propertyName == "devProName")){
	                	  return (selectobj instanceof topo.Text);
	                  }
	                  else if ((propertyName == "labelfontsize")){
	                	  property.setEditable(true);
	                	  return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table));
	                  }
	                  else {
	                	  return !(selectobj instanceof Link);
	                  }
              }  
              else {
                  return true;
              }
		 	}
            else{                                                               //模板
            	property.setEditable(false);
            	if(propertyname == "name"){
            		var nodetypeid = selectobj.getClient("nodetypeid");          //逆变器，数采，三相（两相），箱变，电表，环境仪，汇流�?
        	    	 if((nodetypeid == 54) || (nodetypeid == 5) || (nodetypeid == 18) ||(nodetypeid == 13) ||(nodetypeid == 15) ||(nodetypeid == 16) ||(nodetypeid == 21) ||(nodetypeid == 39)||(nodetypeid == 41)||(nodetypeid == 42)||(nodetypeid == 44)||(nodetypeid == 45)||(nodetypeid == 48)||(nodetypeid == 49)||(nodetypeid == 50) || (nodetypeid == 52) || (nodetypeid == 56)){
        	    		 var image = selectobj.getImage();
         	    		 if(topo.Util.isShowName(image)|| (image == "nibianqi3d")|| (image == "jzNBQ3D")|| (image == "3d-zlHLX")){
         	    			return true;
         	    		 }
         	    		 else{
         	    			return false; 
         	    		 }
        	    	 }
        	    	 else{
        	    		 return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table)) ;
        	    	 }
         	    }
            	if((propertyname == "width") || (propertyname == "height")){
             	   return ((selectobj instanceof topo.HengXian) || (selectobj instanceof topo.ShuXian));
          	    }
	            if (propertyTpe === 'style') {
	                  var propertyName = property.getPropertyName();
	                  if (propertyName.indexOf('label') == 0) {                   //标签相关的属性都显示
	                	  if(propertyName == "label.xoffset" || propertyName == "label.yoffset"){
								return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table)) && (!(selectobj instanceof topo.Text));
						  }
						  else{
								return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table));
						  }
	                  } 
	                  if (propertyName.indexOf('link') == 0) {                   //线条相关的属�?
	                      return selectobj instanceof Link;
	                  } 
	                  if(propertyName.indexOf('grid') == 0 ){
	                  	return selectobj instanceof topo.Table || selectobj instanceof topo.JZZuChuan;                 //表格
	                  }
	                  if(propertyName == 'vector.outline.color'){
		                  	return (selectobj instanceof topo.SkipButton) ||  (selectobj instanceof topo.StatusButton)  || (selectobj instanceof topo.GuangZiPai) || (selectobj instanceof topo.ShapeNode);             
		              }
					  if(propertyName == 'vector.fill.color'){
						  return (selectobj instanceof topo.SkipButton || selectobj instanceof topo.StatusButton  || selectobj instanceof topo.HengXian || selectobj instanceof topo.ShuXian ||selectobj instanceof topo.GuangZiPai || (selectobj instanceof topo.ShapeNode));
					  }
					  if(propertyName == 'vector.shape'){
						  return (selectobj instanceof topo.SkipButton ||selectobj instanceof topo.StatusButton || selectobj instanceof topo.HengXian || selectobj instanceof topo.ShuXian ||selectobj instanceof topo.GuangZiPai);
					  }
					  if(propertyName == 'component.height' || propertyName == 'component.width'  ||propertyName=='component.fillcolor' ||propertyName=="circleChart.color" ) {                    //曲线图属性
							return selectobj instanceof topo.circleChart;
					  } 
	             }
	             if (propertyTpe === 'client') {
	                var propertyName = property.getPropertyName();
					if((propertyName == "highvswitch") || (propertyName == "lowvcircuitbreaker1") ||(propertyName == "lowvcircuitbreaker2")){
	                	  return (selectobj instanceof topo.XiangBian);       //箱变
	                  }
	                  else if ((propertyName == "devicename")){ 
	                	  return ((selectobj instanceof topo.XiangBian) || (selectobj instanceof topo.NiBianQi) || (selectobj instanceof topo.ShuJuCaiJiQi)|| (selectobj instanceof topo.TGJ)
	                			  || (selectobj instanceof topo.DianBiao) || (selectobj instanceof topo.gkDianBiao) || (selectobj instanceof topo.hjzDianBiao) || (selectobj instanceof topo.cydFactoryDianBiao)|| (selectobj instanceof topo.cydFactoryNonDianBiao) 
	                			  || (selectobj instanceof topo.HuJingJianCeYi) || (selectobj instanceof topo.JLHuiLiuXiang)
	                			  //|| (selectobj instanceof topo.SanXiang) || (selectobj instanceof topo.LiangXiangLJ) || (selectobj instanceof topo.LiangXiangSJ)
	                			   ||topo.Util.isShowDevName(selectobj)
	                			  || (selectobj instanceof topo.Text) || (selectobj instanceof topo.DuanLuQi) || (selectobj instanceof topo.DuanLuQiZJX)
	                			  || (selectobj instanceof topo.JieDiKaiGuanZuo) || (selectobj instanceof topo.GuangZiPai) || (selectobj instanceof topo.Shelf23)|| (selectobj instanceof topo.Shelf24)
	                			  || (selectobj instanceof topo.Shelf22) || (selectobj instanceof topo.pidTopo) || (selectobj instanceof topo.pidTopo3D)
	                			  || (selectobj instanceof topo.ShouChe)|| (selectobj instanceof topo.YuanKong));
	                  }
	                  else if ((propertyName == "ip") ||(propertyName == "secondaddress")||(propertyName == "kksCode") ||(propertyName == "ESN") ||(propertyName == "devicePort")){ 
	                	  return ((selectobj instanceof topo.XiangBian) || (selectobj instanceof topo.NiBianQi) || (selectobj instanceof topo.ShuJuCaiJiQi)|| (selectobj instanceof topo.TGJ)
	                			  || (selectobj instanceof topo.DianBiao) || (selectobj instanceof topo.gkDianBiao) || (selectobj instanceof topo.hjzDianBiao) || (selectobj instanceof topo.cydFactoryDianBiao)|| (selectobj instanceof topo.cydFactoryNonDianBiao) 
	                			  || (selectobj instanceof topo.HuJingJianCeYi) || (selectobj instanceof topo.JLHuiLiuXiang)|| (selectobj instanceof topo.ZLHuiLiuXiang)|| (selectobj instanceof topo.JZNiBianQi) || (selectobj instanceof topo.pidTopo));
	                  }
	                  else if ((propertyName == "modelVersionName")){
	                	  return ((selectobj instanceof topo.XiangBian) || (selectobj instanceof topo.NiBianQi) || (selectobj instanceof topo.ShuJuCaiJiQi)|| (selectobj instanceof topo.TGJ)
	                			  || (selectobj instanceof topo.DianBiao) || (selectobj instanceof topo.gkDianBiao) || (selectobj instanceof topo.hjzDianBiao) || (selectobj instanceof topo.cydFactoryDianBiao)|| (selectobj instanceof topo.cydFactoryNonDianBiao) 
	                			  || (selectobj instanceof topo.HuJingJianCeYi) || (selectobj instanceof topo.JLHuiLiuXiang)
	                			  || (selectobj instanceof topo.NiBianQi3D || (selectobj instanceof topo.pidTopo) || (selectobj instanceof topo.pidTopo3D) || (selectobj instanceof topo.ZLHuiLiuXiang) || (selectobj instanceof topo.ZLHuiLiuXiang3D))
	                			  //|| (selectobj instanceof topo.SanXiang3D)|| (selectobj instanceof topo.LiangXiang3DLJ)
	                			  //|| (selectobj instanceof topo.LiangXiang3DSJ)|| (selectobj instanceof topo.SanXiang) || (selectobj instanceof topo.LiangXiangLJ) 
	                			  //|| (selectobj instanceof topo.LiangXiangSJ))
	                			  ||topo.Util.isShowDevVerName(selectobj))
	                  }
	                  else if((propertyName == "parentdevName")){
	                	  return ((selectobj instanceof topo.ZLHuiLiuXiang) || (selectobj instanceof topo.JZNiBianQi));
	                  }
	                  else if ((propertyName == "topographname")){
	                	  return ((selectobj instanceof topo.ZiZhen)|| (selectobj instanceof topo.ZiZhenXJ)  || (selectobj instanceof topo.StatusButton) || (selectobj instanceof topo.SkipButton) || (selectobj instanceof topo.IndexNode) || (selectobj instanceof topo.ShapeNode));       //子阵，跳转按�?
	                  }
	                  else if ((propertyName == "signalname")){
	                	  return ((selectobj instanceof topo.Text)|| (selectobj instanceof topo.GuangZiPai) || (selectobj instanceof topo.DuanLuQi)
	                			  || (selectobj instanceof topo.DuanLuQiZJX)|| (selectobj instanceof topo.DuanLuQi3D)|| (selectobj instanceof topo.JieDiKaiGuanZuo)
	                			  || (selectobj instanceof topo.NiBianQiKaiGuan)|| (selectobj instanceof topo.Shelf23)|| (selectobj instanceof topo.Shelf22)|| (selectobj instanceof topo.Shelf24)
	                			  || (selectobj instanceof topo.ShouChe)|| (selectobj instanceof topo.YuanKong));      
	                  }
	                  else if ((propertyName == "yksignalname")){
	                	  /*return ((selectobj instanceof topo.DuanLuQi)|| (selectobj instanceof topo.DuanLuQiZJX));*/
	                	  return false;
	                  }
	                  else if ((propertyName == "ykkqsignalname")){
	                	  return ((selectobj instanceof topo.NiBianQiKaiGuan)|| (selectobj instanceof topo.DuanLuQi3D) 
	                			  || (selectobj instanceof topo.DuanLuQi) || (selectobj instanceof topo.DuanLuQiZJX) 
	                			  || (selectobj instanceof topo.JieDiKaiGuanZuo)||(selectobj instanceof topo.ShouChe));
	                  }
	                  else if ((propertyName == "ykgbsignalname")){
	                	  return ((selectobj instanceof topo.NiBianQiKaiGuan)|| (selectobj instanceof topo.DuanLuQi3D) 
	                			  || (selectobj instanceof topo.DuanLuQi) || (selectobj instanceof topo.DuanLuQiZJX)
	                			  || (selectobj instanceof topo.JieDiKaiGuanZuo)|| (selectobj instanceof topo.ShouChe));
	                  }
	                  else if((propertyName == "devProColName") || (propertyName == "devProName")){
	                	  return (selectobj instanceof topo.Text);
	                  }
	                  else if ((propertyName == "labelfontsize")){
	                	  return (!(selectobj instanceof Link)) && (!(selectobj instanceof topo.Table));
	                  }
	                  else {
	                	  return !(selectobj instanceof Link);
	                  }
	             }  
	             else {
	                  return true;
	             }
		 	}
        });
    	
        var propertyBox = this.sheet.getPropertyBox();
        var catagory = Msg.topocfg.basepro;
        demo.Util.addAccessorProperty(propertyBox, 'name', catagory,Msg.topocfg.name).setEditable(true);
        var objloc = {map:{'top.top':Msg.topocfg.top,'right.right':Msg.topocfg.right,'left.left':Msg.topocfg.left,'bottom.bottom':Msg.topocfg.bottom,'center':Msg.topocfg.center},
		   values:['top.top','right.right', 'left.left','bottom.bottom','center']};
        demo.Util.addStyleProperty(propertyBox, 'label.position', catagory,Msg.topocfg.namepos).setEnumInfo(objloc);
        demo.Util.addStyleProperty(propertyBox, 'label.color', catagory,Msg.topocfg.labelcolor).setValueType("color");
        demo.Util.addStyleProperty(propertyBox, 'label.xoffset', catagory,Msg.topocfg.namexoffset).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'label.yoffset', catagory,Msg.topocfg.nameyoffset).setEditable(true);
        var mapobj = {};
        mapobj[Msg.topocfg.font12] = "12";
        mapobj[Msg.topocfg.font14] = "14";
        mapobj[Msg.topocfg.font16] = "16";
        mapobj[Msg.topocfg.font18] = "18";
        var objfont = {map:mapobj,values:[Msg.topocfg.font12,Msg.topocfg.font14,Msg.topocfg.font16,Msg.topocfg.font18]};
        demo.Util.addStyleProperty(propertyBox, 'label.font', catagory,Msg.topocfg.namefonsize).setEnumInfo(objfont);
        demo.Util.addClientProperty(propertyBox, 'devicename', catagory,Msg.topocfg.assdevname).setEditable(false);
        catagory = Msg.topocfg.linkpro;
        demo.Util.addAccessorProperty(propertyBox, 'width', catagory,Msg.topocfg.width).setEditable(true);
        demo.Util.addAccessorProperty(propertyBox, 'height', catagory,Msg.topocfg.height).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'vector.outline.color', catagory,Msg.topocfg.bordercolor).setValueType("color");
        demo.Util.addStyleProperty(propertyBox, 'vector.fill.color', catagory,Msg.topocfg.fillcolor).setValueType("color");
        var objshape = {map:{'rectangle':Msg.topocfg.rectangle,'circle':Msg.topocfg.circle,'diamond':Msg.topocfg.diamond,'oval':Msg.topocfg.oval,'triangle':Msg.topocfg.triangle,'pentagon':Msg.topocfg.pentagon,'hexagon':Msg.topocfg.hexagon},
     		   values:['rectangle','circle','diamond','oval','triangle','pentagon','hexagon']};
        demo.Util.addStyleProperty(propertyBox, 'vector.shape', catagory,Msg.topocfg.fillshape).setEnumInfo(objshape);
        demo.Util.addStyleProperty(propertyBox, 'link.width', catagory,Msg.topocfg.linkwidth).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'link.color', catagory,Msg.topocfg.linkcolor).setValueType("color");
        demo.Util.addStyleProperty(propertyBox, 'link.from.xoffset', catagory,Msg.topocfg.linkfromxoffset).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'link.from.yoffset', catagory,Msg.topocfg.linkfromyoffset).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'link.to.xoffset', catagory,Msg.topocfg.linktoxoffset).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'link.to.yoffset', catagory,Msg.topocfg.linktoyoffset).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'link.extend', catagory,Msg.topocfg.linkextend).setValueType("number");
        catagory = Msg.topocfg.clientpro;
        demo.Util.addClientProperty(propertyBox, 'nodetypename', catagory,Msg.topocfg.nodetypename).setEditable(false); 
        demo.Util.addClientProperty(propertyBox, 'ip', catagory,Msg.topocfg.ipaddress).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'ESN', catagory,"ESN：").setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'kksCode', catagory,Msg.topocfg.kkscode).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'secondaddress', catagory,Msg.topocfg.secondAddress).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'devicePort', catagory,Msg.topocfg.deviceportShow).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'topographname', catagory,Msg.topocfg.asstoponame).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'modelVersionName', catagory,Msg.topocfg.assdevvername).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'highvswitch', catagory,Msg.topocfg.gaoyafuhekaiguanpro).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'lowvcircuitbreaker1', catagory,Msg.topocfg.diyaduanluqionepro).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'lowvcircuitbreaker2', catagory,Msg.topocfg.diyaduanluqitwopro).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'signalname', catagory,Msg.topocfg.asssigname).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'yksignalname', catagory,Msg.topocfg.assctlsigname).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'ykkqsignalname', catagory,Msg.topocfg.assctlstartsigname).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'ykgbsignalname', catagory,Msg.topocfg.assctlstopsigname).setEditable(false);
        demo.Util.addClientProperty(propertyBox, 'devProName', catagory,Msg.topocfg.assdevproname).setEditable(false);
       
        catagory = Msg.topocfg.tablepro;
        demo.Util.addStyleProperty(propertyBox, 'grid.row.count', catagory,Msg.topocfg.rowcount).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'grid.column.count', catagory,Msg.topocfg.columncount).setEditable(true);
		demo.Util.addStyleProperty(propertyBox, 'grid.fill.color', catagory,Msg.topocfg.tableFillColor).setValueType("color");
		demo.Util.addStyleProperty(propertyBox, 'grid.fill', catagory,Msg.topocfg.tableFill).setEditable(true);
		demo.Util.addStyleProperty(propertyBox, 'grid.border', catagory,Msg.topocfg.tableBorder).setEditable(true);
		demo.Util.addStyleProperty(propertyBox, 'grid.deep', catagory,Msg.topocfg.tableDeep).setEditable(true);
		demo.Util.addStyleProperty(propertyBox, 'grid.padding', catagory,Msg.topocfg.tablePadding).setEditable(true);
		demo.Util.addStyleProperty(propertyBox, 'grid.cell.deep', catagory,Msg.topocfg.tableCellDeep).setEditable(true);
	
       // demo.Util.addClientProperty(propertyBox, 'parentdevid', catagory,Msg.topocfg.parentdevid).setEditable(false);//所关联设备
        demo.Util.addClientProperty(propertyBox, 'parentdevName', catagory,Msg.topocfg.parentdevName).setEditable(false);//所关联设备
        
        demo.Util.addStyleProperty(propertyBox, 'component.height', catagory,Msg.topocfg.circleChartHeight).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'circleChart.color', catagory,Msg.topocfg.circleChartColor).setValueType("color");
        demo.Util.addStyleProperty(propertyBox, 'component.width', catagory,Msg.topocfg.circleChartWidth).setEditable(true);
        demo.Util.addStyleProperty(propertyBox, 'component.fillcolor', catagory,Msg.topocfg.circleChartFillcolor).setValueType("color");

        
    },
    
    /**
     * 初始化右键菜�?
     */
    initPopupMenu : function () {
    	var self = this;                                                   
		var lastData = null; 
		var lastPoint = null;                                                                       //最后选中的节点和位置  
		var oldlastPoint = null;
		var pageX = null;      
		var pageY = null;
		var selectlist = new twaver.List();
		var copyflag = false;
		var oldpageX = null;
		var oldpageY = null;
		var newpageX = null;      
		var newpageY = null;
		self.popupMenu.onMenuShowing = function(e) {
			/*pageX = e.pageX;
			pageY = e.pageY;*/
			lastData = self.network.getSelectionModel().getLastData();
			self.curselectnode = lastData;
			lastPoint = self.network.getLogicalPoint(e);
			pageX = lastPoint.x;
			pageY = lastPoint.y;
			return true;
		};
		
		self.popupMenu.setFocusColor("#666666");
		self.popupMenu.setWidth(170);
		self.popupMenu.setBorder("0px");
		self.popupMenu.setBackground("#333333");
		self.popupMenu.onMenuItemRendered = function(div,menuItem){
			var $menudiv = $(div);
			$menudiv.css("backgroundColor","#333333");
			$menudiv.css("color","#D8D8D8");
			div.addEventListener("mouseout",function(e){
				div.style.color = "#D8D8D8";
			});
		};
		// 设置右键菜单动作  
			self.popupMenu.onAction = function(menuItem) {
			if (menuItem.label == Msg.topocfg.cutout) {                                                            //删除节点,连同节点的连线也给删�?
				//是否提交校验
				var btnYes = Msg.topocfg.yes;
		    	var btnNo = Msg.topocfg.no;
				var setting = new twaver.SerializationSettings();
				self.setClientPropertyType(setting);
				var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
				//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
				var checkConfSchemaObj = {};
		   		checkConfSchemaObj.schemaData = xmlSerializer.serialize();
		   		checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
		   		checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
		   		checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
		   		checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
		   		var objcv = {
	       				buttons:{
	    				}
	    	   		};
		   		objcv.buttons[btnYes] = function(){
		   			$( this ).dialog( "close" );
					topoComon.topoDeleteFun(self);
				};
				objcv.buttons[btnNo] = function(){
					$( this ).dialog( "close" );
			    };
				$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {

					if(data.success){     //可以直接提交                           
						topoComon.topoDeleteFun(self);
					}
					else{                 //不可以直接提交
						$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
						$("#isContinueSaveTopoDatadlg").dialog("open");
					}
				},false);

			}
			if ((menuItem.label == Msg.topocfg.newandassociateddev)||(menuItem.label == Msg.topocfg.updatedevinfo)) {     //新增,更新设备信息
				var deviceid = lastData.getClient("deviceid");
				
				if(deviceid){
					$("#dlgChoDev" ).dialog({
	    				title:Msg.topocfg.updatedevinfo                 //更新设备信息
					});
					$.omcAjax("/cm/dev/information",{"devID":deviceid}, function (data) {                               //更新
						if (data.success == false){
							
                   	     	 $("#alertmsg").html("");
                   	     	 $("#alertmsg").html(Msg.topocfg.getnodevinfo);                                 //没有取到设备信息
				             $("#alertdlg").dialog("open");
				             $("#modelVersionID").attr("disabled", false);
		     				 return false;
		     			 }
		     			 if(data.success == true){
		     				 	$("#modelVersionID").attr("disabled", false);
			     				var nodetypeid = lastData.getClient("nodetypeid");
			     				$("#bussinessCode").val(data.data.busiCode);               //从设备表里面取数�?
			    				$("#name").val(data.data.name);
			    				$("#ip").val(data.data.ip);
			    				$("#secondaddress").val(data.data.protocolAddr);
			    				$("#kksCode").val(data.data.kksCode);
			    				$("#devicePort").val(data.data.port);
			    				var highVSwitch = data.data.highVSwitch;
			    				var lowVCircuitBreaker1 = data.data.lowVCircuitBreaker1;
			    				var lowVCircuitBreaker2 = data.data.lowVCircuitBreaker2;
			    				var ESN = data.data.ESN;
			    				var devicePort=data.data.port;//这边就是从库里面取的数据
			    				var modverid = lastData.getClient("modelVersionID");
			    				var dataOptions = null;
			    				var objInfo = {pelTypeID: nodetypeid};
								$.omcAjax("/cm/dev/types", objInfo, function (data) {
			                        if (data.success == false){
			                    	     $("#alertmsg").html("");
			                    	     $("#alertmsg").html(Msg.topocfg.getdevverfail);                    //获取设备版本失败
							             $("#alertdlg").dialog("open");
							             $("#modelVersionID").attr("disabled", false);
					     				 return false;
					     			 }
					     			 if(data.success == true){
					     				$("#modelVersionID").attr("disabled", false);
					     				$("#modelVersionID").html("");
					     		  		 var size = data.data.length;
					     		  		 if(size == 0){
					     		  			 $("#alertmsg").html("");
					     		  			 $("#alertmsg").html(Msg.topocfg.noavaildevver);               //没有可用设备版本
					     		             $("#alertdlg").dialog("open");
					     		  			 return false;
					     		  		 }
					     		  		 else{
			                                 var dataOptions = data.data;
					     		  			 $("#modelVersionID").html();
					     		  			 $("#modelVersionID").append("<option value='' name='' selected></option");               //加一列空�?
					     		  			 if(nodetypeid == 15){
					     		  				 //箱变         12.4
					     		  				 $("#dlgChoDev" ).dialog({
					     		    				 title:Msg.topocfg.updatedevinfo,                 //更新设备信息
					     		    				 height:510
					     						 });
					     		  				 $("#esntr").show();
					     		  				 $("#highvswitchtr").show();
					     		  				 $("#lowvcircuitbreaker1tr").show();
					     		  				 $("#lowvcircuitbreaker2tr").show();
					     		  				 $("#devicePort").show();
					     		  				 $("#highvswitch").val(highVSwitch);
					     		  				 $("#lowvcircuitbreaker1").val(lowVCircuitBreaker1);
					     		  				 $("#lowvcircuitbreaker2").val(lowVCircuitBreaker2);
					     		  				 $("#ESN").val(ESN);
					     		  				 $("#devicePort").val(devicePort);
					     		  				 $("#ascurinvstr").hide();
					     		  				 $("#ascurinvstr_111").hide();
					     		  				 
					     						
					     						
					     		  			 }
					     		  			 else if(nodetypeid == 44){
						     		  				$("#dlgChoDev" ).dialog({
						     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
						     		    				 height:430
						     						 });
						     		  				 $("#esntr").show();
						     		  				 $("#highvswitchtr").hide();
						     		  				 $("#lowvcircuitbreaker1tr").hide();
						     		  				 $("#lowvcircuitbreaker2tr").hide();
						     		  				 $("#ESN").val(ESN);
						     		  			     $("#ascurinvstr").hide();
						     		  			     $("#ascurinvstr_111").hide();

						     		  				// 获取当前子阵下所有逆变器，并给下拉赋值
						     						var selectionId = $("#ascurinvs");
						     						getCurrentArrInvs(lastData, self, selectionId);
						     						
						     		  			 }
					     		  			 else{
					     		  				 $("#dlgChoDev" ).dialog({
					     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
					     		    				 height:405
					     						 });
					     		  				 $("#esntr").show();
					     		  				 $("#highvswitchtr").hide();
					     		  				 $("#lowvcircuitbreaker1tr").hide();
					     		  				 $("#lowvcircuitbreaker2tr").hide();
					     		  				 $("#ESN").val(ESN);
					     		  				 $("#ascurinvstr").hide();
					     		  				 $("#ascurinvstr_111").hide();
					     		  				 
					     		  			 }
                                                 if(nodetypeid == 42){
					     		  				$("#dlgChoDev" ).dialog({
					     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
					     		    				 height:430
					     						 });
					     		  				 $("#esntr").show();
					     		  				 $("#highvswitchtr").hide();
					     		  				 $("#lowvcircuitbreaker1tr").hide();
					     		  				 $("#lowvcircuitbreaker2tr").hide();
					     		  				 $("#ESN").val(ESN);
					     		  				 $("#ascurinvstr_111").hide();
					     		  				
					     		  				// 获取当前子阵下所有箱变，并给下拉赋值
					     						var selectionId = $("#ascurinvstr_222");
					     						getCurrentTwoArrInvs(lastData, self, selectionId);
					     						
					     		  			 }
					     		  			 for(var i = 0;i < size ;i++){
					     		  				 var nameOption  = dataOptions[i].name;
					     		  				 var idOption = dataOptions[i].id;
					     		  				 if(idOption == modverid){
					     		  					 if(dataOptions[i].isMultipurpose == 1){
							     		  					$("#modelVersionID").attr("disabled", true);
							     		  					nameOption = dataOptions[i].modelVersionCode;
							     		  				 }
					     		  					$("#modelVersionID").append("<option value='"+idOption+"' name='"+name+"' selected>"+nameOption+"</option");
					     		  				 }
					     		  				 else{
					     		  					 if(dataOptions[i].isMultipurpose == 1){
					     		  						 continue;
					     		  					 }
					     		  					$("#modelVersionID").append("<option value='"+idOption+"' name='"+name+"'>"+nameOption+"</option"); 
					     		  				 }
					     		  			 }
//					     		  			$("#modelVersionID").change();
					     		  			$("#bussinessCode").attr("disabled",true);
					     		  			$("#dlgChoDev").dialog("open");
					     		  		 }	
					     			 }
					     	});
		     			 }
					});
				}
				else{
						$("#dlgChoDev" ).dialog({
		    				title:Msg.topocfg.newandassociateddev                 //新增设备
						});
						var nodetypeid = lastData.getClient("nodetypeid");
	    				$("#bussinessCode").val(lastData.getClient("bussinessCode"));
	    				$("#name").val(lastData.getClient("name"));
	    				$("#ip").val(lastData.getClient("ip"));
	    				$("#secondaddress").val(lastData.getClient("secondaddress"));
	    				$("#kksCode").val(lastData.getClient("kksCode"));
	    				$("#devicePort").val(lastData.getClient("devicePort"));
	    				var curinvsid = lastData.getClient("parentdevid");
	    				var modverid = lastData.getClient("modelVersionID");
	    				var dataOptions = null;
	    				var objInfo = {pelTypeID: nodetypeid};
						$.omcAjax("/cm/dev/types", objInfo, function (data) {
	                        if (data.success == false){
	                        	 /*$("#alertdlg").dialog({height:180});*/
	                    	     $("#alertmsg").html("");
	                    	     $("#alertmsg").html(Msg.topocfg.getdevverfail);            //获取设备版本失败
					             $("#alertdlg").dialog("open"); 
					             $("#modelVersionID").attr("disabled", false);
			     				 return false;
			     			 }
			     			 if(data.success == true){
			     				$("#modelVersionID").attr("disabled", false);
			     				$("#modelVersionID").html("");
			     		  		 var size = data.data.length;
			     		  		 if(size == 0){
			     		  			 /*$("#alertdlg").dialog({height:180});*/
			     		  			 $("#alertmsg").html("");
			     		  			 $("#alertmsg").html(Msg.topocfg.noavaildevver);        //没有可用设备版本
			     		             $("#alertdlg").dialog("open");
			     		  			 return false;
			     		  		 }
			     		  		 else{
	                                 var dataOptions = data.data;
	                                 
	                                 var numOfUse = 0; 
	                                 for(var i = 0;i < size ;i++){
			     		  				 var nameOption  = dataOptions[i].name;
			     		  				 var idOption = dataOptions[i].id;
			     		  				 if(dataOptions[i].isMultipurpose != 1){
		     		  						 numOfUse++;
		     		  					 }
			     		  			 }
	                                 if(numOfUse == 0){
				     		  			 /*$("#alertdlg").dialog({height:180});*/
				     		  			 $("#alertmsg").html("");
				     		  			 $("#alertmsg").html(Msg.topocfg.noavaildevver);        //没有可用设备版本
				     		             $("#alertdlg").dialog("open");
				     		  			 return false;
				     		  		 }

			     		  			 $("#modelVersionID").html();
			     		  			 $("#modelVersionID").append("<option value='' name='' selected></option");               //加一列空�?
			     		  			 if(nodetypeid == 15){                 //箱变         12.4
			     		  				 $("#dlgChoDev" ).dialog({
			     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
			     		    				 height:510
			     						 });
			     		  				 $("#esntr").show();
			     		  				 $("#highvswitchtr").show();
			     		  				 $("#lowvcircuitbreaker1tr").show();
			     		  				 $("#lowvcircuitbreaker2tr").show();
			     		  				 $("#highvswitch").val(Msg.topocfg.gaoyafuhekaiguan);
			     		  				 $("#lowvcircuitbreaker1").val(Msg.topocfg.diyaduanluqione);
			     		  				 $("#lowvcircuitbreaker2").val(Msg.topocfg.diyaduanluqitwo);
			     		  				 $("#ESN").val(lastData.getClient("ESN"));
			     		  				 $("#ascurinvstr").hide();
			     		  				 $("#ascurinvstr_111").hide();
			     						
			     		  			 }else if(nodetypeid == 44){
			     		  				$("#dlgChoDev" ).dialog({
			     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
			     		    				 height:430
			     						 });
			     		  				 $("#esntr").show();
			     		  				 $("#highvswitchtr").hide();
			     		  				 $("#lowvcircuitbreaker1tr").hide();
			     		  				 $("#lowvcircuitbreaker2tr").hide();
			     		  				 $("#ESN").val(lastData.getClient("ESN"));
			     		  				 $("#ascurinvstr").hide();
			     		  				 $("#ascurinvstr_111").hide();
			     		  				
			     		  				// 获取当前子阵下未关联的逆变器，并给下拉赋值
			     						var selectionId = $("#ascurinvs");
			     						getCurrentArrInvs(lastData, self, selectionId);
			     						
			     		  			 }
			     		  			 else{
			     		  				 $("#dlgChoDev" ).dialog({
			     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
			     		    				 height:405
			     						 });
			     		  				 $("#esntr").show();
			     		  				 $("#highvswitchtr").hide();
			     		  				 $("#lowvcircuitbreaker1tr").hide();
			     		  				 $("#lowvcircuitbreaker2tr").hide();
			     		  				 $("#ESN").val(lastData.getClient("ESN"));
			     		  				 $("#ascurinvstr").hide();
			     		  				 $("#ascurinvstr_111").hide();
			     		  				
			     		  			 }
                                       if(nodetypeid == 42){
			     		  				$("#dlgChoDev" ).dialog({
			     		    				 title:Msg.topocfg.newandassociateddev,                 //新增
			     		    				 height:430
			     						 });
			     		  				 $("#esntr").show();
			     		  				 $("#highvswitchtr").hide();
			     		  				 $("#lowvcircuitbreaker1tr").hide();
			     		  				 $("#lowvcircuitbreaker2tr").hide();
			     		  				 $("#ESN").val(lastData.getClient("ESN"));
			     		  				 $("#ascurinvstr_111").hide();

			     		  				// 获取当前子阵下未关联的箱变，并给下拉赋值
			     						var selectionId = $("#ascurinvstr_222");
			     						getCurrentTwoArrInvs(lastData, self, selectionId);
			     						
			     						
			     		  			 }
			     		  			 for(var i = 0;i < size ;i++){
			     		  				 var nameOption  = dataOptions[i].name;
			     		  				 var idOption = dataOptions[i].id;
			     		  				 if(dataOptions[i].isMultipurpose == 1){
		     		  						 continue;
		     		  					 }
			     		  				 if(idOption == modverid){
			     		  					$("#modelVersionID").append("<option value='"+idOption+"' name='"+name+"' selected>"+nameOption+"</option");
			     		  				 }
			     		  				 else{
			     		  					$("#modelVersionID").append("<option value='"+idOption+"' name='"+name+"'>"+nameOption+"</option"); 
			     		  				 }
			     		  			 }
			     		  			$("#modelVersionID").change();
			     		  			$("#bussinessCode").attr("disabled",false);
			     		  			$("#dlgChoDev").dialog("open");
			     		  		 }	
			     			 }
				     	});
		 	    }
			}
			
			if (menuItem.label == Msg.topocfg.associatesignal) {                                                      //关联信号
				var modelversionid = lastData.getClient("modelVersionID");
				topo.Util.getDeviceSignal(modelversionid);                                           //从服务端得到关联设备(根据设备ID来获取信�?
			}
			
//			if(menuItem.label == Msg.topocfg.associateinventer){                                     //关联逆变�?
//				var nodetypeid = lastData.getClient("nodetypeid");
//				var parentdevid = lastData.getClient("parentdevid");
//				var ConfSchemaInfo = {};
//              ConfSchemaInfo.id = self.curConfSchemaObj.busiObjectId;
//				topo.Util.getCurrentArrInvs(ConfSchemaInfo,nodetypeid,parentdevid);
//			}
			
			if (menuItem.label == Msg.topocfg.associatedevsignal) {                                                   //关联设备信号
				$("#dlgChoAssNode" ).dialog({
					title:Msg.topocfg.associatedevsignal
				});
				self.isRemote = false;
				$("#selectedNode").html("");
				var nodetypeidstr = lastData.getClient("nodetypeid");
				//从图元取设备
				if((nodetypeidstr == 6) || (nodetypeidstr == 67)||((nodetypeidstr == 7 || nodetypeidstr == 66 ) && (self.curConfSchemaObj.schemeTypeId != 14) && (self.curConfSchemaObj.schemeTypeId != 10) && (self.curConfSchemaObj.schemeTypeId != 8) && (self.curConfSchemaObj.schemeTypeId != 2) && (self.curConfSchemaObj.schemeTypeId != 1)&& (self.curConfSchemaObj.schemeTypeId != 7))||
				  (nodetypeidstr == 8)||((nodetypeidstr == 14) && (self.curConfSchemaObj.schemeTypeId != 8) && (self.curConfSchemaObj.schemeTypeId != 2) && (self.curConfSchemaObj.schemeTypeId != 1)&& (self.curConfSchemaObj.schemeTypeId != 7))||
				  (nodetypeidstr == 27)||(nodetypeidstr == 40) || (nodetypeidstr == 53) || (nodetypeidstr == 56) || (nodetypeidstr == 69)){
					//隐藏分区和子阵的下拉框
					$("#xialaliebiao").hide();
					$("#comcMod").hide();
					var datas = self.box.getDatas();  
					//排序
					datas.sort(function(ele1,ele2){
						if((ele1 instanceof twaver.Follower && ele1.getHost() instanceof twaver.Grid) && (ele2 instanceof twaver.Follower && ele2.getHost() instanceof twaver.Grid)){
							return 0;
						}else if((ele1 instanceof twaver.Follower && ele1.getHost() instanceof twaver.Grid)){
							return 1;
						}else if((ele2 instanceof twaver.Follower && ele2.getHost() instanceof twaver.Grid)){
							return -1;
						}else if(ele1 instanceof topo.JZZuChuan){
							return 1;
						}else if(ele2 instanceof topo.JZZuChuan){
							return -1;
						}else{
							var name1 = ele1.getName();
							var name2 = ele2.getName();
							if(name1 != null && name1 != "" && name1 != undefined && name2 != null && name2 != "" && name2 != undefined){                   
								var minlen = name1.length < name2.length ? name1.length : name2.length;
								for(var i = 0;i < minlen ;i++){
									if(name1.charAt(i) < name2.charAt(i)){
										return -1;
									}
									else if(name1.charAt(i) > name2.charAt(i)){
										return 1;
									}
								}
								if(minlen == name1.length && minlen == name2.length){
									return 0;
								}
								else if(minlen == name1.length ){
									return -1;
								}
								else{
									return 1;
								}
							}
							else{
								if( (name1 == null || name1 == "" || name1 == undefined) && (name2 == null || name2 == "" || name2 == undefined)){
									return 0;
								}
								else if(name1 == null || name1 == "" ||  name1 == undefined){
									return -1;
								}
								else{
									return 1;
								}
							}
						}
					});
					var devorver = false;                                             //关联设备信号还是版本信号    false:设备，true：版�?
	     	        datas.forEach(function(e){
	     	        	var deviceid = e.getClient("deviceid");                       //关联了设备的图元
	     	        	var hostnodeid  = e.getClient("hostnodeid");
	     	        	var modelversionID = e.getClient("modelVersionID");
	     	        	var nodetypeid = e.getClient("nodetypeid");
	     	        	if((nodetypeid == 5)||(nodetypeid == 13) || (nodetypeid == 15) || (nodetypeid == 16) || (nodetypeid == 18) || (nodetypeid == 21) || (nodetypeid == 39)|| (nodetypeid == 41)|| (nodetypeid == 42)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 45) || (nodetypeid == 53) || (nodetypeid == 56) || (nodetypeid == 57) || (nodetypeid == 69)){
	     	        		var typeflag = false;
	     	        		if((nodetypeidstr == 6) ||(nodetypeidstr == 8) ||(nodetypeidstr == 67)){                //组串只能关联当前页面逆变器有deviceid的信�?
		     	        		if((nodetypeid == 5) && deviceid ){                                                                           
		     	        			typeflag = true;
		     	        			devorver = false;
		     	        		}
		     	        		$("#choDevName").show();
		     		  			$("#choVerName").hide();
		     	        	} 
		     	        	else if((nodetypeidstr == 46)){ // 集中式组串只能关联当前页直流汇流�?
		     	        		if((nodetypeid == 44) && deviceid ){                                                                           
		     	        			typeflag = true;
		     	        			devorver = false;
		     	        		}
		     	        		$("#choDevName").show();
		     		  			$("#choVerName").hide();
		     	        	}
		     	        	else if(nodetypeidstr == 40){                                   //逆变器开关只能关联当前图上的有版本没有deviceid的逆变器信�?
								if(((nodetypeid == 5) && modelversionID && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 5))||((nodetypeid == 41) && modelversionID && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 9)) || ((nodetypeid == 57) && modelversionID && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 13))){                                                              
									typeflag = true;
									devorver = true;
								}
								$("#choDevName").hide();
		     		  			$("#choVerName").show();
		     	        	}
		     	        	else if(nodetypeidstr == 27){                                   // 断路器（3D）关联当前页面的三相(3D)关联了版本没有设备id的信�?
								//if((nodetypeid == 13) &&((e.getImage() == "sanxiang3dr") || (e.getImage() == "liangxiang3dsjr")||(e.getImage() == "liangxiang3dljr")) 
		     	        		if((nodetypeid == 13) &&(topo.Util.isAssDevVerMenuVisibleForXB(e.getImage())) 
										&& modelversionID && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 4)){                                      
									typeflag = true;
									devorver = true;
								}
								$("#choDevName").hide();
		     		  			$("#choVerName").show();
		     	        	}
	                        else{                                                           //7.text ,14光字�?                                               
	                        	if(self.curConfSchemaObj.schemeTypeId == 5){                //当前图是逆变器分�?
	                        		if(modelversionID && !deviceid && (nodetypeid == 5)){    //仅取关联了版本的逆变器的信号
	                        			typeflag = true;
	                        			devorver = true;
	                        		}
	                        		$("#choDevName").hide();
	    	     		  			$("#choVerName").show();
	                        	}
	                        	else if(self.curConfSchemaObj.schemeTypeId == 9){           
	                        		if(modelversionID && !deviceid && (nodetypeid == 41)){   //集中式逆变�?
	                        			typeflag = true;
	                        			devorver = true;
	                        		}
	                        		$("#choDevName").hide();
	    	     		  			$("#choVerName").show();
	                        	}
	                        	else if(self.curConfSchemaObj.schemeTypeId == 4){           //箱变分图
	                        		if(modelversionID && !deviceid && (nodetypeid == 13)){   //仅取关联了版本的三相的信�?
	                        			typeflag = true;
	                        			devorver = true;
	                        		}
	                        		$("#choDevName").hide();
	    	     		  			$("#choVerName").show();
	                        	}
	                        	else if(self.curConfSchemaObj.schemeTypeId == 12){          //直流汇流箱分图
	                        		if(modelversionID && !deviceid && (nodetypeid == 45)){
	                        			typeflag = true;
	                        			devorver = true;
	                        		}
	                        		$("#choDevName").hide();
	    	     		  			$("#choVerName").show();
	                        	}
	                        	else if(self.curConfSchemaObj.schemeTypeId == 13){          //pid分图
	                        		if(modelversionID && !deviceid && (nodetypeid == 57)){
	                        			typeflag = true;
	                        			devorver = true;
	                        		}
	                        		$("#choDevName").hide();
	    	     		  			$("#choVerName").show();
	                        	}
	                        	else{
	                        		if(deviceid && (nodetypeid != 13)){                                     //非逆变器分图或者是箱变分图(非三�?
	                        			typeflag = true;
	                        			devorver = false;
	                        		}
	                        		$("#choDevName").show();
	    	     		  			$("#choVerName").hide();
	                        	}
	                        }
		     	        	if(typeflag){                                                         //有设备ID的肯定有版本id 
		     	        		 //逆变器分图，箱变分图，直流汇流箱分图
		     	        		 if((self.curConfSchemaObj.schemeTypeId == 4)||(self.curConfSchemaObj.schemeTypeId == 5) ||(self.curConfSchemaObj.schemeTypeId == 9) || (self.curConfSchemaObj.schemeTypeId == 15)||(self.curConfSchemaObj.schemeTypeId == 12)||(self.curConfSchemaObj.schemeTypeId == 13)){
		     	        			var modelVersionName = e.getClient("modelVersionName");
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		var assSigNodemodelVersionID = lastData.getClient("modelVersionID")
			     	        		if(modelversionID == assSigNodemodelVersionID){
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+modelVersionName+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+modelVersionName+"</option");
			     	        		}
		     	        		 }
		     	        		 else{
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		if(deviceid == lastData.getClient("deviceid")){
			     	        			 $("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+e.getName()+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+e.getName()+"</option");
			     	        		} 
		     	        		 }
		     	        	}
	     	        	
	     	        	}//逆变器分图，箱变分图
	     	        });
	     	        if($("#selectedNode").html() == ""){
	     	        	 if((self.curConfSchemaObj.schemeTypeId == 4)||(self.curConfSchemaObj.schemeTypeId == 5) ||(self.curConfSchemaObj.schemeTypeId == 9) || (self.curConfSchemaObj.schemeTypeId == 15) || (self.curConfSchemaObj.schemeTypeId == 13)){
	     	        		if($("#selectedNode").html() == ""){
	     	        			/*$("#alertdlg").dialog({height:180});*/
	     	        			$("#alertmsg").html("");
			     	        	$("#alertmsg").html(Msg.topocfg.noavailassnode);            //没有可关联图�?
					            $("#alertdlg").dialog("open");
			     	        	return false;
	     	        		}
	     	        	 }
	     	        	 else{
	     	        		/*$("#alertdlg").dialog({height:180});*/
	     	        		$("#alertmsg").html("");
		     	        	$("#alertmsg").html(Msg.topocfg.noavailassdev);                //没有可关联设�?
				            $("#alertdlg").dialog("open");
		     	        	return false; 
	     	        	 }
	     	        }
	     	        else{
	     	        	self.signalflag = "0";
		     	        self.devChooseChange(self.curselectnode,self.signalflag,devorver);                                               //根据选择的设备，来显示不同的信号
	     	        }
				}
				else{                                                   //从设备表取设�?   接地开关，隔离刀闸，断路�?
					/*var bindInfo = {};
					$.omcAjax("/cm/SchemaNodeBind/getAllDevs",bindInfo, function(data) {
						 if(data.success == false){
							 $("#alertdlg").dialog({height:180});
							 $("#alertmsg").html("");
							 $("#alertmsg").html(Msg.topocfg.getdevlistfail);          //获取设备列表失败
				             $("#alertdlg").dialog("open");
							 return false;
						 }
						 if(data.success == true){
							 var datadevs = data.data;
							 for(var i = 0;i < datadevs.length; i++){
								 var deviceid = datadevs[i].id                      
				     	         var modelversionID = datadevs[i].modelVersionId;
				     	         var name = datadevs[i].name;
				     	         if(deviceid == lastData.getClient("deviceid")){
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' selected>"+name+"</option");
				     	         }
				     	         else{
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' >"+name+"</option");
				     	         }
							 }
							 
							 if($("#selectedNode").html() == ""){
									$("#alertdlg").dialog({height:180});
				     	        	$("#alertmsg").html("");
				     	        	$("#alertmsg").html(Msg.topocfg.noavailassdev);        //没有可关联设�?
						            $("#alertdlg").dialog("open");
				     	        	return false;
				     	     }
				     	     else{
					     	    	$("#choDevName").show();
			     		  			$("#choVerName").hide();
					     	    	self.signalflag = "0";
						     	    self.devChooseChange(self.curselectnode,self.signalflag,false);                                                         //根据选择的设备，来显示不同的信号
				     	     }
						 }
					 });*/
					//显示分区和子阵的下拉框
					var runMode = parent.Cookies.get('ComcMode');
					if(runMode && runMode=='COMC'){
						$("#comcMod").show();
						$("#xialaliebiao").hide();
						topoComon.getComcStation(self,lastData,0,1);
					}
					if(!runMode || runMode!='COMC'){
						$("#xialaliebiao").show();
						$("#comcMod").hide();
						topoComon.getAllArea(self,lastData,0);
					}
					
				}
			}
			//关联遥控信号
			if (menuItem.label == Msg.topocfg.assctlsig) {                             //断路器，断路器（3d�?
				$("#dlgChoAssNode" ).dialog({
					title:Msg.topocfg.assctlsig
				});
				self.isRemote = false;
				$("#selectedNode").html("");
				var nodetypeidstr = lastData.getClient("nodetypeid");
				//从图元取设备
				if(nodetypeidstr == 27){                                       //断路器，断路器（3d），从图元上取三相信�?    
					var datas = self.box.getDatas();
	     	        datas.forEach(function(e){
		     	        	var deviceid = e.getClient("deviceid");                //关联了设备的图元
		     	        	var hostnodeid  = e.getClient("hostnodeid");
		     	        	var modelversionID = e.getClient("modelVersionID");
		     	        	var nodetypeid = e.getClient("nodetypeid");
		     	        	if(nodetypeid && (nodetypeid == 5) || (nodetypeid == 13) || (nodetypeid == 15) || (nodetypeid == 16) || (nodetypeid == 18) || (nodetypeid == 21) || (nodetypeid == 39)|| (nodetypeid == 41)|| (nodetypeid == 42)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52)){
			     	        	var typeflag = false;
			     	        	if((nodetypeid == 13) &&((e.getImage() == "sanxiang3dr") || (e.getImage() == "liangxiang3dljr") || (e.getImage() == "liangxiang3dsjr")) && modelversionID && 
			     	        			!deviceid &&(self.curConfSchemaObj.schemeTypeId == 4)){   //断路�?7，三�?D，两相（3D，两脚，三脚）有版本 ，无deviceid 
			     	        		$("#choDevName").hide();
			     		  			$("#choVerName").show();
									typeflag = true;
								}
			     	        	if(typeflag){      
			     	        		var modelVersionName = e.getClient("modelVersionName");
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		var assSigNodemodelVersionID = lastData.getClient("modelVersionID")
			     	        		if(modelversionID == assSigNodemodelVersionID){
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+modelVersionName+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+modelVersionName+"</option");
			     	        		}
			     	        	}
	     	        	   }
	     	        });
	     	        if($("#selectedNode").html() == ""){
	     	        	/*$("#alertdlg").dialog({height:180});*/
	     	        	$("#alertmsg").html("");
	     	        	$("#alertmsg").html(Msg.topocfg.noavailassnode);              //没有可关联图�?
			            $("#alertdlg").dialog("open");
	     	        	return false;
	     	        }
	     	        else{
	     	        	self.signalflag = "1";
		     	        self.devChooseChange(self.curselectnode,self.signalflag,true);                                               //根据选择的设备，来显示不同的信号
	     	        }
				}
				else{                                                                            //断路�?9，从设备表里面取   
					var bindInfo = {};
					$.omcAjax("/cm/SchemaNodeBind/getAllDevs",bindInfo, function(data) {
						 if(data.success == false){
							 /*$("#alertdlg").dialog({height:180});*/
							 $("#alertmsg").html("");
							 $("#alertmsg").html(Msg.topocfg.getdevlistfail);                   //获取设备列表失败
				             $("#alertdlg").dialog("open");
							 return false;
						 }
						 if(data.success == true){
							 var datadevs = data.data;
							 for(var i = 0;i < datadevs.length; i++){
								 var deviceid = datadevs[i].id                      
				     	         var modelversionID = datadevs[i].modelVersionId;
				     	         var name = datadevs[i].name;
				     	         if(deviceid == lastData.getClient("deviceid")){
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' selected>"+name+"</option");
				     	         }
				     	         else{
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' >"+name+"</option");
				     	         }
							 }
							 
							 if($("#selectedNode").html() == ""){
								/*$("#alertdlg").dialog({height:180});*/
			     	        	$("#alertmsg").html("");
			     	        	$("#alertmsg").html(Msg.topocfg.noavailassdev);              //没有可关联设�?
					            $("#alertdlg").dialog("open");
			     	        	return false;
				     	     }
				     	     else{
				     	    	$("#choDevName").show();
		     		  			$("#choVerName").hide();
				     	    	self.signalflag = "1";
					     	    self.devChooseChange(self.curselectnode,self.signalflag,false);                                                         //根据选择的设备，来显示不同的信号
				     	     }
						 }
					 });
				}
			}
			
			//关联遥控开启信�?
			if (menuItem.label == Msg.topocfg.assctlstartsig){
				var lastnodetypeid  = lastData.getClient("nodetypeid");
				$("#dlgChoAssNode" ).dialog({
					title:Msg.topocfg.assctlstartsig
				});
				self.isRemoteStart = true;
				$("#selectedNode").html("");
				if(lastnodetypeid != 9 && lastnodetypeid != 31 && lastnodetypeid != 64 && lastnodetypeid != 65){
					//隐藏分区和子阵的下拉框
					$("#xialaliebiao").hide();
					$("#comcMod").hide();
					var datas = self.box.getDatas();
					datas.forEach(function(e){
	     	        	var deviceid = e.getClient("deviceid");                       
	     	        	var hostnodeid  = e.getClient("hostnodeid");
	     	        	var modelversionID = e.getClient("modelVersionID");
	     	        	var nodetypeid = e.getClient("nodetypeid");
	     	            if(nodetypeid && (nodetypeid == 5) || (nodetypeid == 13) || (nodetypeid == 15) || (nodetypeid == 16) || (nodetypeid == 18) || (nodetypeid == 21) || (nodetypeid == 39)|| (nodetypeid == 41)|| (nodetypeid == 44)|| (nodetypeid == 42)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 57)){
		     	        	if(lastnodetypeid == 40){
		     	        		if((modelversionID && (nodetypeid == 5) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 5))||(modelversionID && (nodetypeid == 41) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 9)) || (modelversionID && (nodetypeid == 57) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 13))){              //逆变器开�?选取当前图上的可用逆变�?有版本，无设备id
			     	        		var modelVersionName = e.getClient("modelVersionName");
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		var assSigNodemodelVersionID = lastData.getClient("modelVersionID")
			     	        		if(modelversionID == assSigNodemodelVersionID){
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+modelVersionName+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+modelVersionName+"</option");
			     	        		}
			     	        	}
		     	        	}
		     	        	if(lastnodetypeid == 27){
		     	        		if((modelversionID && (nodetypeid == 13) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 4))){              //逆变器开�?选取当前图上的可用逆变�?有版本，无设备id
			     	        		var modelVersionName = e.getClient("modelVersionName");
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		var assSigNodemodelVersionID = lastData.getClient("modelVersionID")
			     	        		if(modelversionID == assSigNodemodelVersionID){
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+modelVersionName+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+modelVersionName+"</option");
			     	        		}
			     	        	}
		     	        	}
     	        	   }
					});
					if($("#selectedNode").html() == ""){
	     	        	/*$("#alertdlg").dialog({height:180});*/
	     	        	$("#alertmsg").html("");
	     	        	$("#alertmsg").html(Msg.topocfg.noavailassnode);             //没有可关联图�?
			            $("#alertdlg").dialog("open");
	     	        	return false;
	     	        }
	     	        else{
	     	        	$("#choDevName").hide();
     		  			$("#choVerName").show();
	     	        	self.signalflag = "2";
		     	        self.devChooseChange(self.curselectnode,self.signalflag,true);                                                               //根据选择的设备，来显示不同的信号
	     	        }
				}
				else{
					/*var bindInfo = {};
					$.omcAjax("/cm/SchemaNodeBind/getAllDevs",bindInfo, function(data) {
						 if(data.success == false){
							 $("#alertdlg").dialog({height:180});
							 $("#alertmsg").html("");
							 $("#alertmsg").html(Msg.topocfg.getdevlistfail);                   //获取设备列表失败
				             $("#alertdlg").dialog("open");
							 return false;
						 }
						 if(data.success == true){
							 var datadevs = data.data;
							 for(var i = 0;i < datadevs.length; i++){
								 var deviceid = datadevs[i].id                      
				     	         var modelversionID = datadevs[i].modelVersionId;
				     	         var name = datadevs[i].name;
				     	         if(deviceid == lastData.getClient("deviceid")){
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' selected>"+name+"</option");
				     	         }
				     	         else{
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' >"+name+"</option");
				     	         }
							 }
							 if($("#selectedNode").html() == ""){
				     	        	$("#alertdlg").dialog({height:180});
				     	        	$("#alertmsg").html("");
				     	        	$("#alertmsg").html(Msg.topocfg.noavailassnode);             //没有可关联图�?
						            $("#alertdlg").dialog("open");
				     	        	return false;
				     	      }
				     	      else{
				     	        	$("#choDevName").show();
			     		  			$("#choVerName").hide();
				     	        	self.signalflag = "2";
					     	        self.devChooseChange(self.curselectnode,self.signalflag,true);                                                               //根据选择的设备，来显示不同的信号
				     	     }
						 }
					 });*/
					//显示分区和子阵的下拉框
//					$("#xialaliebiao").show();
//					topoComon.getAllArea(self,lastData,2);
					var runMode = parent.Cookies.get('ComcMode');
					if(runMode && runMode=='COMC'){
						$("#comcMod").show();
						$("#xialaliebiao").hide();
						topoComon.getComcStation(self,lastData,2);
					}
					if(!runMode || runMode!='COMC'){
						$("#xialaliebiao").show();
						$("#comcMod").hide();
						topoComon.getAllArea(self,lastData,2);
					}
				}
			}
			//关联遥控关闭信号
			if (menuItem.label == Msg.topocfg.assctlstopsig) { 
				var lastnodetypeid  = lastData.getClient("nodetypeid");
				$("#dlgChoAssNode" ).dialog({
					title:Msg.topocfg.assctlstopsig
				});
				self.isRemoteStop = true;
				$("#selectedNode").html("");
				if(lastnodetypeid != 9 && lastnodetypeid != 31 && lastnodetypeid != 64 && lastnodetypeid != 65){
					//隐藏分区和子阵的下拉框
					$("#xialaliebiao").hide();
					$("#comcMod").hide();
					var datas = self.box.getDatas();
	     	        datas.forEach(function(e){
	     	        	var deviceid = e.getClient("deviceid");                        //逆变器开�?选取当前图上的可用逆变�?
	     	        	var hostnodeid  = e.getClient("hostnodeid");
	     	        	var modelversionID = e.getClient("modelVersionID");
	     	        	var nodetypeid = e.getClient("nodetypeid");
	     	        	if(nodetypeid && (nodetypeid == 5) || (nodetypeid == 13) || (nodetypeid == 15) || (nodetypeid == 16) || (nodetypeid == 18) || (nodetypeid == 21) || (nodetypeid == 39)|| (nodetypeid == 41)|| (nodetypeid == 42)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 57)){
	     	        		if(lastnodetypeid == 40){
	     	        			if((modelversionID && (nodetypeid == 5) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 5))||(modelversionID && (nodetypeid == 41) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 9)) || (modelversionID && (nodetypeid == 57) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 13))){
			     	        		var modelVersionName = e.getClient("modelVersionName");
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		var assSigNodemodelVersionID = lastData.getClient("modelVersionID")
			     	        		if(modelversionID == assSigNodemodelVersionID){
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+modelVersionName+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+modelVersionName+"</option");
			     	        		}
			     	        	}
	     	        		}
	     	        		if(lastnodetypeid == 27){
	     	        			if((modelversionID && (nodetypeid == 13) && !deviceid &&(self.curConfSchemaObj.schemeTypeId == 4))){              //逆变器开�?选取当前图上的可用逆变�?有版本，无设备id
			     	        		var modelVersionName = e.getClient("modelVersionName");
		     	        			var nameOption  = e.getName();
			     	        		var idOption = e.getId();
			     	        		var assSigNodemodelVersionID = lastData.getClient("modelVersionID")
			     	        		if(modelversionID == assSigNodemodelVersionID){
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' selected>"+modelVersionName+"</option");
			     	        		}
			     	        		else{
			     	        			$("#selectedNode").append("<option value='"+e.getClient("deviceid")+"@@"+e.getId()+"@@"+e.getClient("modelVersionID")+"' >"+modelVersionName+"</option");
			     	        		}
			     	        	}
	     	        		}
	     	        	}
	     	        });
	     	        if($("#selectedNode").html() == ""){
	     	        	/*$("#alertdlg").dialog({height:180});*/
	     	        	$("#alertmsg").html("");
	     	        	$("#alertmsg").html(Msg.topocfg.noavailassnode);               //没有可关联图�?
			            $("#alertdlg").dialog("open");
	     	        	return false;
	     	        }
	     	        else{
	     	        	$("#choDevName").hide();
     		  			$("#choVerName").show();
	     	        	self.signalflag = "3";
		     	        self.devChooseChange(self.curselectnode,self.signalflag,true);                                                               //根据选择的设备，来显示不同的信号
	     	        }
				}
				else{
					/*var bindInfo = {};
					$.omcAjax("/cm/SchemaNodeBind/getAllDevs",bindInfo, function(data) {
						 if(data.success == false){
							 $("#alertdlg").dialog({height:180});
							 $("#alertmsg").html("");
							 $("#alertmsg").html(Msg.topocfg.getdevlistfail);                   //获取设备列表失败
				             $("#alertdlg").dialog("open");
							 return false;
						 }
						 if(data.success == true){
							 var datadevs = data.data;
							 for(var i = 0;i < datadevs.length; i++){
								 var deviceid = datadevs[i].id                      
				     	         var modelversionID = datadevs[i].modelVersionId;
				     	         var name = datadevs[i].name;
				     	         if(deviceid == lastData.getClient("deviceid")){
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' selected>"+name+"</option");
				     	         }
				     	         else{
				     	        	 $("#selectedNode").append("<option value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' >"+name+"</option");
				     	         }
							 }
							 if($("#selectedNode").html() == ""){
				     	        	$("#alertdlg").dialog({height:180});
				     	        	$("#alertmsg").html("");
				     	        	$("#alertmsg").html(Msg.topocfg.noavailassnode);             //没有可关联图�?
						            $("#alertdlg").dialog("open");
				     	        	return false;
				     	      }
				     	      else{
				     	        	$("#choDevName").show();
			     		  			$("#choVerName").hide();
				     	        	self.signalflag = "3";
					     	        self.devChooseChange(self.curselectnode,self.signalflag,true);                                                               //根据选择的设备，来显示不同的信号
				     	     }
						 }
					 });*/
					//显示分区和子阵的下拉框
					var runMode = parent.Cookies.get('ComcMode');
					if(runMode && runMode=='COMC'){
						$("#comcMod").show();
						$("#xialaliebiao").hide();
						topoComon.getComcStation(self,lastData,3);
					}
					if(!runMode || runMode!='COMC'){
						$("#xialaliebiao").show();
						$("#comcMod").hide();
						topoComon.getAllArea(self,lastData,3);
					}
					
//					$("#xialaliebiao").show();
//					topoComon.getAllArea(self,lastData,3);
				}
					
			}
			
			//关联拓扑�?
			if (menuItem.label == Msg.topocfg.associatetopo) {
				var nodetypeid = lastData.getClient("nodetypeid");
				var topographid = lastData.getClient("topographid");
				var ConfSchemaInfo = {};
                ConfSchemaInfo.id = self.curConfSchemaObj.id;
				topo.Util.getTopoGraphs(ConfSchemaInfo,nodetypeid,topographid);
			}
			//关联已有设备
			if (menuItem.label ==  Msg.topocfg.associatedev) {                //关联设备
				var nodetypeid = lastData.getClient("nodetypeid");
				var deviceid = lastData.getClient("deviceid");
				if(nodetypeid == 13){
					topo.Util.getDevsByType(nodetypeid,deviceid);             //三相，两�?
				}
				else{
					// 如果右键点击的不是直流汇流箱，则隐藏“关联逆变器”下拉
					$("#associateinventerId").hide();
					$("#associatejzinventerId").hide();
					$("#choosedevdlg").dialog({height : 160});
					
					topo.Util.getNotBindDevsByType(nodetypeid,deviceid);             //逆变器，数采，汇流箱，箱变，环境仪，电表
					
					if (nodetypeid == 44){ // 直流汇流箱
						// 显示“关联逆变器”下拉
						$("#associateinventerId").show();
						$("#choosedevdlg").dialog({height : 192});
						
						// 获取当前子阵下未关联的逆变器，并给下拉赋值
						var selectionId = $("#ascurinvs_associate");
						getCurrentArrInvs(lastData, self, selectionId);
					}else{
						if(nodetypeid == 42){//集中式逆变器
							$("#associatejzinventerId").show();
							$("#choosedevdlg").dialog({height : 192});
						//获取当前子阵下未关联的箱变，并给下拉赋值
							var selectionId = $("#ascurinvs_associate1");
							getCurrentTwoArrInvs(lastData, self, selectionId);
						}
					}
				}
				
			}
			//解除绑定（逆变器，数采，箱变，交流汇流箱，电表，环境仪�?
			if (menuItem.label ==  Msg.topocfg.removebind) {                  //解除绑定
				var btnYes = Msg.topocfg.yes;
		   	    var btnNo = Msg.topocfg.no;
				var setting = new twaver.SerializationSettings();
				self.setClientPropertyType(setting);
				var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
				//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
				 var checkConfSchemaObj = {};
		   		 checkConfSchemaObj.schemaData = xmlSerializer.serialize();
		   		 checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
		   		 checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
		   		 checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
		   		 checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
				var objcv = {
	       				buttons:{
	    				}
	    	   		};
		   		objcv.buttons[btnYes] = function(){
		   			$( this ).dialog( "close" );
					topoComon.removeBindFun(lastData,self);
				};
				objcv.buttons[btnNo] = function(){
					$( this ).dialog( "close" );
			    };
				$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
					if(data.success){     
						topoComon.removeBindFun(lastData,self);
					}
					else{                 //不可以直接提交
						$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
						$("#isContinueSaveTopoDatadlg").dialog("open");
					}
				},false);
			}
			
			//更换图片
			if (menuItem.label == Msg.topocfg.changepic) {
				var picPathSel = lastData.getClient("picpath");
				$("#picPathSel").html("");
				$("#input_text").val("");
				$("#picUpLoadFile").val("");
				var objInfo = {};
				$.omcAjax("/cm/userNodePic/getImageList", objInfo, function (data) {
                    if (data.success == false){
                    	     /*$("#alertdlg").dialog({height:180});*/
                    	     $("#alertmsg").html("");
                    	     $("#alertmsg").html(data.data.message);
				             $("#alertdlg").dialog("open");
		     				 return false;
		     			 }
		     			 if(data.success == true){
		     				 var piclist = data.data;
		     				 if(piclist.length > 0){
		     					 for(var i = 0;i < piclist.length ;i++){
		     						 if(picPathSel == piclist[i]){
		     							 $("#picPathSel").append("<option value='"+piclist[i]+"' selected>"+piclist[i]+"</option");
		     						 }
		     						 else{
		     							 $("#picPathSel").append("<option value='"+piclist[i]+"' >"+piclist[i]+"</option");
		     						 }
		     					 }
		     					 $("#picPathSel").change();
		     				 }
		     				 $("#changepicdlg").dialog("open");
		     			 }
		     	});
			}
			
			//关联设备属�?
			if (menuItem.label == Msg.topocfg.assdevpro) {
				$("#choosedevfromdb").html("");
				//针对分图(逆变器分图，箱变分图,直流汇流箱分图)
				if((self.curConfSchemaObj.schemeTypeId == 4)||(self.curConfSchemaObj.schemeTypeId == 5) ||(self.curConfSchemaObj.schemeTypeId == 9) || (self.curConfSchemaObj.schemeTypeId == 12) || (self.curConfSchemaObj.schemeTypeId == 13)){
					$("#relateDevInfo").dialog({height:270});
					$("#choosedevfromdblabel").hide();
					$("#choosedevfromdb").hide();
					topo.Util.getDeviceInfo(self.curselectnode);
				}
				else{
					$("#relateDevInfo").dialog({height:300})
					$("#choosedevfromdblabel").show();
					$("#choosedevfromdb").show();
					$.omcAjax("/cm/SchemaNodeBind/getAllDevs",{}, function(data) {
						 if(data.success == false){
							 $("#alertmsg").html("");
							 $("#alertmsg").html(Msg.topocfg.getdevlistfail);          //获取设备列表失败
				             $("#alertdlg").dialog("open");
							 return false;
						 }
						 if(data.success == true){
							 var datadevs = data.data;
							 for(var i = 0;i < datadevs.length; i++){
								 var deviceid = datadevs[i].id                      
				     	         var name = datadevs[i].name;
				     	         if(deviceid == lastData.getClient("deviceid")){
				     	        	 $("#choosedevfromdb").append("<option value='"+deviceid+"' selected>"+name+"</option");
				     	         }
				     	         else{
				     	        	 $("#choosedevfromdb").append("<option value='"+deviceid+"' >"+name+"</option");
				     	         }
							 }
							 if($("#choosedevfromdb").html() == ""){
				     	        	$("#alertmsg").html("");
				     	        	$("#alertmsg").html(Msg.topocfg.noavailassdev);        //没有可关联设�?
						            $("#alertdlg").dialog("open");
				     	        	return false;
				     	     }
				     	     else{
				     	    	    self.chooseDevFromDBChange(self.curselectnode);
				     	     }
						 }
					 });
				}
			}
			
			//关联设备版本
			if (menuItem.label == Msg.topocfg.associatedevver) {
				//取设备版本信�?
				var nodetypeid = lastData.getClient("nodetypeid");
				var modelVersionID = lastData.getClient("modelVersionID");
                var objInfo = {pelTypeID: nodetypeid};
				$.omcAjax("/cm/dev/types", objInfo, function (data) {
                    if (data.success == false){
                    	     /*$("#alertdlg").dialog({height:180});*/
                    	     $("#alertmsg").html("");
                    	     $("#alertmsg").html(Msg.topocfg.getverlistfail);            //获取版本列表失败
				             $("#alertdlg").dialog("open");
				             $("#modelVersionID").attr("disabled", false);
		     				 return false;
		     		}
		     		if(data.success == true){
		     			    $("#modelVersionID").attr("disabled", false);
		     				$("#modelVersionID").html("");
		     		  		 var size = data.data.length;
		     		  		 if(size == 0){
		     		  			 /*$("#alertdlg").dialog({height:180});*/
		     		  			 $("#alertmsg").html("");
		     		  			 $("#alertmsg").html(Msg.topocfg.noavaildevver);        //没有可用设备版本
		     		             $("#alertdlg").dialog("open");
		     		  			 return false;
		     		  		 }
		     		  		 else{
                                 var dataOptions = data.data;
		     		  			 $("#selectedDevVer").html("");
		     		  			 for(var i = 0;i < size ;i++){
		     		  				 var nameOption  = dataOptions[i].name;
		     		  				 var idOption = dataOptions[i].id;                  //限制关联设备版本在箱变分图和逆变器分�?（加上直流汇流箱 ）
		     		  				 if((self.curConfSchemaObj.busiObjectId == idOption ) &&  (self.curConfSchemaObj.schemeTypeId == 4 || self.curConfSchemaObj.schemeTypeId == 5 || self.curConfSchemaObj.schemeTypeId == 9 || self.curConfSchemaObj.schemeTypeId == 12 || self.curConfSchemaObj.schemeTypeId == 13)){
		     		  					 if((idOption == modelVersionID)){
			     		  					 $("#selectedDevVer").append("<option value='"+idOption+"' name='"+name+"' checked>"+nameOption+"</option");
			     		  				 }
			     		  				 else{
			     		  					 $("#selectedDevVer").append("<option value='"+idOption+"' name='"+name+"' >"+nameOption+"</option");
			     		  				 }
		     		  				 }
		     		  			 }
		     		  			$("#dlgChoDevVer").dialog("open");
		     		  		 }	
		     			 }
		     	});
			}
			
			//复制
			if (menuItem.label == Msg.topocfg.copy) {
				var selectlisttemp = self.box.getSelectionModel().getSelection();
				locObj.minxele = null;
				locObj.minyele = null;
				locObj.maxxele = null;
				locObj.maxyele = null;
				selectlisttemp.forEach(function(e){                                      //寻找最左边和最上边的元�?
					if(!(e instanceof twaver.Link) && !((e instanceof twaver.Grid) && !(e instanceof topo.Shelf23) && !(e instanceof topo.Shelf24) && !(e instanceof topo.Shelf22)&& !(e instanceof topo.JZZuChuan)&& !(e instanceof topo.Table)&& !(e instanceof topo.HengXian)&& !(e instanceof topo.ShuXian)&& !(e instanceof topo.GuangZiPai) && !(e instanceof topo.StatusButton) && !(e instanceof topo.SkipButton) && !(e instanceof topo.IndexNode)) && e){

						if(locObj.minxele == null){
							locObj.minxele = getEleMarginValue(self.network,e,"minx");           //最小的X
						}
						else{
							var tempminx = getEleMarginValue(self.network,e,"minx");             //最小的X
							if(tempminx < locObj.minxele){
								locObj.minxele = tempminx;
							}
						}
						
						if(locObj.minyele == null){
							locObj.minyele = getEleMarginValue(self.network,e,"miny");           //最小的y
						}
						else{
							var tempminy = getEleMarginValue(self.network,e,"miny");             //最小的y
							if(tempminy < locObj.minyele){
								locObj.minyele = tempminy;
							}
						}
						
						if(locObj.maxxele == null){
							locObj.maxxele = getEleMarginValue(self.network,e,"maxx");           //最大的X
						}
						else{
							var tempmaxx = getEleMarginValue(self.network,e,"maxx");             //最大的X
							if(tempmaxx > locObj.maxxele){
								locObj.maxxele = tempmaxx;
							}
						}
						
						if(locObj.maxyele == null){
							locObj.maxyele = getEleMarginValue(self.network,e,"maxy");           //最大的y
						}
						else{
							var tempmaxy = getEleMarginValue(self.network,e,"maxy");             //最大的y
							if(tempmaxy > locObj.maxyele){
								locObj.maxyele = tempmaxy;
							}
						}
					}
				});
				selectlist.clear();
				topo.Util.topoCopy(selectlisttemp,selectlist);
				copyflag = true;
				/*oldpageX = pageX;
				oldpageY = pageY;*/
				oldpageX = lastPoint.x;
				oldpageY = lastPoint.y;
				oldlastPoint = lastPoint
			}
			//粘贴
			if (menuItem.label == Msg.topocfg.paste) {
				var selectlistpaste = new twaver.List();
				topo.Util.topoCopy(selectlist,selectlistpaste);
				if(selectlistpaste.size() > 0){
				    var xzeroflag = false;
				    var yzeroflag = false;
				    var xshift = "";
				    var yshift = "";
				    if((pageX - oldpageX)>= 0){                                                   
				    	var mousepointsubx = pageX - oldpageX;
				    	if((mousepointsubx + locObj.maxxele) > MAXX ){         
				    		xshift = MAXX  - locObj.maxxele;
				    	}
				    	else{
				    		xshift = pageX - oldpageX;
				    	}
				    }
				    else{
				    	var subx = locObj.minxele + pageX - oldpageX
				    	if(subx > MINX){
				    		xshift = pageX - oldpageX;
				    	}
				    	else{
				    		xshift = MINX - locObj.minxele;
				    	}
				    }
				    if((pageY - oldpageY)>= 0){
				    	var mousepointsuby = pageY - oldpageY;
				    	if((mousepointsuby + locObj.maxyele) > MAXY){          
				    		yshift = MAXY - locObj.maxyele;
				    	}
				    	else{
				    		yshift = pageY - oldpageY;
				    	}
				    }
				    else{
				    	var suby = locObj.minyele + pageY - oldpageY
				    	if(suby > MINY){
				    		yshift = pageY - oldpageY;
				    	}
				    	else{
				    		yshift = MINY - locObj.minyele;
				    	}
				    }
					selectlistpaste.forEach(function(e){
						if(!(e instanceof twaver.Link) && !((e instanceof twaver.Grid) && !(e instanceof topo.Shelf23) && !(e instanceof topo.Shelf24) && !(e instanceof topo.Shelf22)&& !(e instanceof topo.JZZuChuan)&& !(e instanceof topo.Table)&& !(e instanceof topo.HengXian)&& !(e instanceof topo.ShuXian)&& !(e instanceof topo.GuangZiPai) && !(e instanceof topo.StatusButton)  && !(e instanceof topo.SkipButton) && !(e instanceof topo.IndexNode)) && e){
							var newpositionx = e.getLocation().x + xshift;
							var newpositiony = e.getLocation().y + yshift;
							if(e instanceof topo.ShapeNode){
								var pointsList = e.getPoints();
								var pointsListTemp = new twaver.List();
								pointsList.forEach(function(e){
									var pointTemp = {x:0,y:0};
									pointTemp.x = e.x + xshift;
									pointTemp.y = e.y + yshift;
									pointsListTemp.add(pointTemp);
								});
								e.setPoints(pointsListTemp);
							}
							e.setLocation(newpositionx,newpositiony);
						}
						if(e instanceof topo.JZZuChuan){
							for(var i=0;i<e.getStyle("grid.column.count");i++){
				    	    	for(var j=0;j<e.getStyle("grid.row.count");j++){
				    	    		var cell=new twaver.Grid();
				    	    		cell.setImage("zuchuanlan");
				    	    		cell.setStyle("follower.row.index",j);
				    	    		cell.setStyle("follower.column.index",i);
				    	    		cell.setStyle('label.color', "#ffffff");
				    	    		cell.setStyle('label.position', "bottom.bottom");
				    	    		cell.setStyle('label.font', Msg.topocfg.font12);
				    	    		cell.setHost(e);
				    	    		e.addChild(cell);
				    	    		self.box.add(cell);
				    	    	}
				    	    }
						}
						self.box.add(e);
						self.box.getSelectionModel().appendSelection(e);                              //粘贴选中
					});
				}
			}
				//关联其他站
			if (menuItem.label ==  Msg.topocfg.associateotherstation) {               //关联其他站
				var nodetypeid = lastData.getClient("nodetypeid");
				var deviceid = lastData.getClient("deviceid");

				topo.Util.getAllDevsBypelType(nodetypeid,deviceid);
			}
			
			//解除关联
			if (menuItem.label ==  Msg.topocfg.unassociatetopo) {               //解除关联
				/*var topographid = lastData.getClient("topographid");
				var topographname = lastData.getClient("topographname");
				lastData.setClient("topographid",null);
				lastData.setClient("topographname",null);
				if("28" == lastData.getClient("nodetypeid")){                   //跳转按钮
					lastData.setName(Msg.topocfg.skipbutton);
				}else if("55" == lastData.getClient("nodetypeid")){	            //索引节点
					lastData.setName(Msg.topocfg.indexnode);
				}
				else{
					lastData.setName("");                                       //子阵
				}
				self.updateCurTopo();*/
				var btnYes = Msg.topocfg.yes;
		    	var btnNo = Msg.topocfg.no;
				var setting = new twaver.SerializationSettings();
	    		self.setClientPropertyType(setting);
	    		var xmlSerializer = new twaver.XmlSerializer(self.box,setting);                        
	    		//self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
	    		 var checkConfSchemaObj = {};
		   		 checkConfSchemaObj.schemaData = xmlSerializer.serialize();
		   		 checkConfSchemaObj.busiObjectId = self.curConfSchemaObj.busiObjectId;
		   		 checkConfSchemaObj.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
		   		 checkConfSchemaObj.id = self.curConfSchemaObj.id;                                                      
		   		 checkConfSchemaObj.timeStamp = self.curConfSchemaObj.timeStamp;
	    		var objcv = {
	       				buttons:{
	    				}
	    	   		};
		   		objcv.buttons[btnYes] = function(){
		   			$( this ).dialog( "close" );
		   			topoComon.unassociateTopoFun(lastData,self);
				};
				objcv.buttons[btnNo] = function(){
					$( this ).dialog( "close" );
			    };
	    		$.omcAjax("/cm/ConfSchemaInfo/checkVersionChanged",checkConfSchemaObj, function (data) {
	    			if(data.success){                 
	    				topoComon.unassociateTopoFun(lastData,self);
	    			}
	    			else{                
	    				$("#isContinueSaveTopoDatadlg" ).dialog(objcv);
	    				$("#isContinueSaveTopoDatadlg").dialog("open");
	    			}
	    		},false);

			}

            //关联计算信号
            if (menuItem.label == Msg.topocfg.bindCalcSignal) {      
				$("#dlgChoCalcSignal").dialog({
					title:Msg.topocfg.bindCalcSignal
				});
				self.isRemote = false;
				var calcSigSelect = $("#calcSigSelect");
				calcSigSelect.html("");
                var calcSigBelongSelect = $('#calcSigBelongSelect');
                var calcSigBelongDiv = $('#calcSigBelongDiv');
                calcSigBelongSelect.prop("disable", true);
                calcSigBelongSelect.html('');
				var lastSignalName;
                var lastSigObj;
                var lastSigKind;
                var nodeTypeId = lastData.getClient('texttype');
                if(nodeTypeId == 3) {
                    lastSignalName = lastData.getClient("signalname");
                    lastSigObj = lastData.getClient("signalobject");
                    lastSigKind = lastData.getClient("signalkind");
                }

				$.omcAjax("/northCalculate/northSignals",{"signalName": lastSignalName, "lastSigKind": lastSigKind}, function(data) {
					if(data.success == false){
						$("#alertmsg").html(Msg.topocfg.getCalcSignalFailed);
						$("#alertdlg").dialog("open");
						return false;
					}

					var calcSignals = data.data.calcSignals;
                    var hasSndSelect = data.data.hasSndSelect;
                    var signalBelongs = data.data.signalBelongs;
                    var signalObjectType = data.data.signalObjectType;

					if(calcSignals == null) {
						$("#alertmsg").html(Msg.topocfg.getCalcSignalFailed);
						$("#alertdlg").dialog("open");
						return false;
					}
					if(calcSignals.length == 0) {
						$("#alertmsg").html(Msg.topocfg.noCalcSignal);
						$("#alertdlg").dialog("open");
						return false;
					}
					for(var i = 0;i < calcSignals.length; i++){
						var signalName = calcSignals[i].name;
						var signalUnit = calcSignals[i].metroUnit;
                        var signalKind = calcSignals[i].algorithmKind;
                        if(signalName == lastSignalName) {
                            calcSigSelect.append('<option value="' + signalName + '@@'+ signalUnit + '@@'+ signalKind + '" selected>' + signalName + '</option>');
                        } else {
						    calcSigSelect.append('<option value="' + signalName + '@@'+ signalUnit + '@@'+ signalKind + '">' + signalName + '</option>');
                        }
					}
                    if (hasSndSelect) {
                        calcSigBelongDiv.show();
                        if (signalObjectType == 1) {
                            for(var i=0; i<signalBelongs.length; i++) {
                                if (lastSigObj == signalBelongs[i].busiCode) {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].busiCode+'" name="'+signalBelongs[i].name+'" selected>'+signalBelongs[i].name+'</option>')
                                } else {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].busiCode+'" name="'+signalBelongs[i].name+'" >'+signalBelongs[i].name+'</option>')
                                }
                            }
                        } else if (signalObjectType == 2) {
                            for(var i=0; i<signalBelongs.length; i++) {
                                if (lastSigObj == signalBelongs[i].id) {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].id+'" name="'+signalBelongs[i].name+'" selected>'+signalBelongs[i].name+'</option>')
                                } else {
                                    calcSigBelongSelect.append('<option value="'+signalBelongs[i].id+'" name="'+signalBelongs[i].name+'" >'+signalBelongs[i].name+'</option>')
                                }
                            }
                        }
                    } else {
                        calcSigBelongDiv.hide();
                    }
                    $("#dlgChoCalcSignal").dialog("open");

				});
            }
		};
		self.popupMenu.setMenuItems([                                                                 // 设置右键菜单内容  
		     { label: Msg.topocfg.updatedevinfo },                       //更新设备信息
		     { label: Msg.topocfg.newandassociateddev, group: 'hostElemnet' },
		     //{ label: '关联信号', group: 'hostElemnet' },
		     { label: Msg.topocfg.associatedevsignal, group: 'affixElement' },
		     { label: Msg.topocfg.assctlsig, group: 'affixElement' },
		     { label: Msg.topocfg.assctlstartsig, group: 'affixElement' },
		     { label: Msg.topocfg.assctlstopsig, group: 'affixElement' },
		     { label: Msg.topocfg.associatetopo, group: 'affixElement' },
		     { label: Msg.topocfg.unassociatetopo, group: 'affixElement' },
			{ label: Msg.topocfg.associatedevver, group: 'nibianqi' },
			{ label: Msg.topocfg.changepic },
			{ label: Msg.topocfg.associatedev },
			{ label: Msg.topocfg.associateotherstation },                 //关联其他站			
			{ label: Msg.topocfg.activeregulation },//有功调节
			{ label: Msg.topocfg.reactivePowerRegulation },//无功调节
			{ label: Msg.topocfg.powerFactorAdjustment },//功率因素调节
			//{ label: Msg.topocfg.associateinventer},                  //关联逆变
			{ label: Msg.topocfg.removebind },                          //解除绑定
			{ label: Msg.topocfg.assdevpro },      //关联设备属
			{ label: Msg.topocfg.bindCalcSignal },
			{ label: Msg.topocfg.copy },
			{ label: Msg.topocfg.paste },
			{ label: Msg.topocfg.cutout, group: 'all' }
		 ]);
		var runMode = parent.Cookies.get('ComcMode');
		if(runMode && runMode=='COMC'){
			var menuArr = self.popupMenu.getMenuItems();
			for(var i=0;i<menuArr.length;i++){
				var e = menuArr[i];
				if(e.label==Msg.topocfg.bindCalcSignal){
					menuArr.splice(i,1);
					break;
				}
			}
			self.popupMenu.setMenuItems(menuArr);
		}
		self.popupMenu.isVisible = function(menuItem) {
				//设置右键菜单是否可见
			var selectnode = self.box.getSelectionModel().getSelection();
			 var nodeortpl = true;
			 if(self.treenodetype == "node"){
				 nodeortpl = true;
			 }
			 else{
				 nodeortpl = false;
			 }
			 if (self.newConfSchemaObj.schemeTypeId == 11) {
				 nodeortpl = false;
			}
			 
			 var ifmutiple = false;
			 if(selectnode.size() > 1){
				 ifmutiple = true;
			 }
			 if (lastData) 
			 {  
				 var nodetypeid = lastData.getClient("nodetypeid");                                      //主图元才能关联设备（例如 逆变器）
				 if(menuItem.label == Msg.topocfg.newandassociateddev){
					 if(distribute && self.newConfSchemaObj.schemeTypeId ==1){ //分布式汇集站中的设备无法确认是哪个分区的，所以禁止分布式汇集站接线图中新增设备
						 return false;
					 }
					 if(!ifmutiple && nodeortpl){                                                        //新增设备
						 var deviceid = lastData.getClient("deviceid");
						 if(!((deviceid != null)&& (deviceid != "") && (deviceid != undefined))){        //无设备ID，可以新�?
							 if((nodetypeid == 5)||(nodetypeid == 18)||(nodetypeid == 42)){
								 var image = lastData.getImage();
								 return ((image == "nibianqizcr")||(image == "shujucaijiqir")||(image == "jzNBQ-right"));
							 }
							 else if(nodetypeid && (nodetypeid == 16)||(nodetypeid == 15)||(nodetypeid == 21)||(nodetypeid == 39)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 56)){  //环境仪，三相箱变，汇流箱
								 return true;
							 }
							 else{
								 return false;
							 }
						 }
						 else{
							 return false;
						 }
					 }
					 else{
						 return false;
					 }
				 }
				 if(menuItem.label ==  Msg.topocfg.removebind ){              //解除绑定
					 if(!ifmutiple && nodeortpl){
						 if(nodetypeid && (nodetypeid == 5)||(nodetypeid == 18)||(nodetypeid == 15)||(nodetypeid == 16)||(nodetypeid == 39)||(nodetypeid == 21)||(nodetypeid == 42)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52)|| (nodetypeid == 54) || (nodetypeid == 56) || (nodetypeid == 69)){ //逆变器，数采，箱变，交流汇流箱，电表，环境仪
							 var deviceid = lastData.getClient("deviceid");
							 var hasEMIre = lastData.getClient("relationKeyId");
							 if((deviceid != null)&& (deviceid != "") && (deviceid != undefined) && hasEMIre == undefined){      //有设备ID，可以解�?
								 var image = lastData.getImage();
								 if(nodetypeid == 5){
									 return (image == "nibianqizcr");
								 }else if(nodetypeid == 42){
									 return (image == "jzNBQ-right");
								 }else{
									 return true;
								 } 
							 }
							 else{
								 return false;
							 }
						 }
						 else{
							 return false; 
						 }
				     }
					 else{
						 return false;
					 }
				 }
				 if(menuItem.label ==  Msg.topocfg.updatedevinfo ){              //更新设备信息
					 if(!ifmutiple && nodeortpl){
						 if((nodetypeid == 5)||(nodetypeid == 18)||(nodetypeid == 15)||(nodetypeid == 16)||(nodetypeid == 39)||(nodetypeid == 21)||(nodetypeid == 42)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 56)){ //逆变器，数采，箱变，交流汇流箱，电表，环境仪
							 var image = lastData.getImage();
							 var deviceid = lastData.getClient("deviceid");
							 var hasEMIre = lastData.getClient("relationKeyId");
							 if((deviceid != null)&& (deviceid != "") && (deviceid != undefined) && hasEMIre == undefined){         //有设备ID，可以进行更新设备信息的操作
								 if(nodetypeid == 5){
									 return (image == "nibianqizcr");
								 }else if(nodetypeid == 42){
									 return (image == "jzNBQ-right");
								 }else{
									 return true;
								 }
							 }
							 else{                                                                         //无设备ID，不能进行更新设备信�?
								 return false;
							 }
						 }
						 else{
							 return false; 
						 }
				     }
					 else{
						 return false;
					 }
				 }
				 /*if(menuItem.label == "关联信号" ){
					 return (nodetypeid == 5);
				 }*/
				 if(menuItem.label == Msg.topocfg.associatedevsignal ){           //关联设备信号
					 if(!ifmutiple && nodeortpl){
						 return ((nodetypeid == 6)||(nodetypeid == 7)||(nodetypeid == 8)||(nodetypeid == 14)||(nodetypeid == 27)||(nodetypeid == 9)||
							    (nodetypeid == 31)||(nodetypeid == 32) ||(nodetypeid == 33)||(nodetypeid == 34)||nodetypeid == 40 ||
							    (nodetypeid == 53 && self.curConfSchemaObj.schemeTypeId == 5) 
							    || (nodetypeid == 53 && self.curConfSchemaObj.schemeTypeId == 9)
							    || (nodetypeid == 64) || (nodetypeid == 65) || (nodetypeid == 66)  || (nodetypeid == 67) || (nodetypeid == 68));


					 }
					 else{
						 return false;
					 }
				 }
		
				 if(menuItem.label ==  Msg.topocfg.associatetopo ){              //关联topo�?
					 if(!ifmutiple && nodeortpl){
						 return ((nodetypeid == 4)||(nodetypeid == 28)  ||(nodetypeid == 68) ||(nodetypeid == 55)|| (lastData instanceof topo.ShapeNode));
					 }
					 else{
						 return false;
					 }
				 }
				 if(menuItem.label ==   Msg.topocfg.unassociatetopo ){              //关联topo�?
					 var topographid = lastData.getClient("topographid");
					 if(!ifmutiple && nodeortpl && topographid){
						 return ((nodetypeid == 4)||(nodetypeid == 28) ||(nodetypeid == 68)  ||(nodetypeid == 55)|| (lastData instanceof topo.ShapeNode));
					 }
					 else{
						 return false;
					 }
				 }
				
				 
				 if(menuItem.label == Msg.topocfg.associatedevver ){            //关联设备版本
					 if(!ifmutiple && nodeortpl){
						 if(nodetypeid == 5){                 //逆变�?D
							 if(self.curConfSchemaObj.schemeTypeId != 5){
								 return false;
							 }
							 var image = lastData.getImage();
							 return (image == "nibianqi3d");
						 }
						 else if(nodetypeid == 41){
							 if(self.curConfSchemaObj.schemeTypeId != 9){
								 return false;
							 }
							 var image = lastData.getImage();
							 return (image == "jzNBQ3D");
						 }
						 else if(nodetypeid == 13){          //三相箱变3D，两相两脚，三脚
							 var image = lastData.getImage();
							 //return ((image == "sanxiang3dr") || (image == "liangxiang3dljr") ||(image == "liangxiang3dsjr"));
							 return topo.Util.isAssDevVerMenuVisibleForXB(image);
						 }
						 else if(nodetypeid == 45){          //直流汇流箱
							 if(self.curConfSchemaObj.schemeTypeId != 12){
								 return false;
							 }
							 var image = lastData.getImage();
							 return (image == "3d-zlHLXr");
						 }
						 else if(nodetypeid == 57){          //PID
							 if(self.curConfSchemaObj.schemeTypeId != 13){
								 return false;
							 }
							 var image = lastData.getImage();
							 return (image == "pidTopoImg3D");
						 }
						 else{
							 return false;
						 }
					 }
					 else{
						 return false;
					 }
				 }
				 if(menuItem.label == Msg.topocfg.assdevpro ){        //关联设备信息
					 if(!ifmutiple && nodeortpl){
						 if(nodetypeid == 7 ){                 //逆变�?D
							return true;
						 }
						 else{
							 return false;
						 }
					 }
					 else{
						 return false;
					 }
				 }
				 if(menuItem.label == Msg.topocfg.changepic ){
					 if(!ifmutiple && nodeortpl){
						 return (nodetypeid == 30);
					 }
					 else{
						 return false;
					 }
				 }
				 if(menuItem.label == Msg.topocfg.associatedev ){         //关联设备
					 if(distribute && self.newConfSchemaObj.schemeTypeId ==1){ //分布式汇集站中的设备无法确认是哪个分区的，所以禁止分布式汇集站接线图中关联已有设备
						 return false;
					 }
					 if(!ifmutiple && nodeortpl){
						 if(!(lastData instanceof twaver.Link) && !((lastData instanceof twaver.Grid) && !(lastData instanceof topo.Shelf23) && !(lastData instanceof topo.Shelf22)&& !(lastData instanceof topo.JZZuChuan)&& !(lastData instanceof topo.Table)&& !(lastData instanceof topo.HengXian)&& !(lastData instanceof topo.ShuXian)&& !(lastData instanceof topo.GuangZiPai)  && !(lastData instanceof topo.StatusButton) && !(lastData instanceof topo.SkipButton) && !(lastData instanceof topo.IndexNode)) && lastData){
							 if((self.newConfSchemaObj.schemeTypeId != 2 && self.newConfSchemaObj.schemeTypeId != 3)&& nodetypeid == 69){
								 return false;
							 }
							 var deviceid = lastData.getClient("deviceid");
							 var image = lastData.getImage();              //关联设备 三相,两相（两脚），两相（三脚），逆变器，数采，箱变，交流汇流箱，电表，环境仪
							 return (topo.Util.isAssDevMenuVisibleForXB(nodetypeid,image)
									 ||( ((((nodetypeid == 42) && (image == "jzNBQ-right"))||(nodetypeid == 5) && (image == "nibianqizcr"))||(nodetypeid == 18)||(nodetypeid == 15)||(nodetypeid == 16)||(nodetypeid == 44)||(nodetypeid == 39)||(nodetypeid == 21)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50) || (nodetypeid == 52)||(nodetypeid == 54) || (nodetypeid == 56)||(nodetypeid == 69)) && !deviceid));    
						 }
						 else{
							 return false;
						 }
					 }
					 else{
						 return false;
					 }
				 }
				 
				 if(menuItem.label == Msg.topocfg.assctlsig ){		//断路器关联遥控信�?
					 return false;
				 }
				 
				 
				 if(menuItem.label == Msg.topocfg.assctlstartsig ){   //逆变器开�?箱变分图断路�?
					 if(!ifmutiple && nodeortpl){
						 return ((nodetypeid == 40) || (nodetypeid == 27) || (nodetypeid == 9)|| (nodetypeid == 31) || (nodetypeid == 64));              
					 }
					 else{
						 return false;
					 }
				 }
				 
				 if(menuItem.label == Msg.topocfg.assctlstopsig ){	//逆变器开�?箱变分图断路�?
					 if(!ifmutiple && nodeortpl){
						 return ((nodetypeid == 40) || (nodetypeid == 27) || (nodetypeid == 9)|| (nodetypeid == 31) || (nodetypeid == 64));              
					 }
					 else{
						 return false;
					 }
				 }
				 if((menuItem.label == Msg.topocfg.paste)){//粘贴
					 if(copyflag && (self.parentTreeNodeId !=0) && nodeortpl){
						 return true;
					 }else{
						 return false;
					 }
				 }
				 if((menuItem.label == Msg.topocfg.copy)){//复制
					 if(!ifmutiple){         //单�?
						 return (!(lastData instanceof twaver.Link) && !((lastData instanceof twaver.Grid) && !(lastData instanceof topo.Shelf23) && !(lastData instanceof topo.Shelf24) && !(lastData instanceof topo.Shelf22)&& !(lastData instanceof topo.JZZuChuan)&& !(lastData instanceof topo.Table)&& !(lastData instanceof topo.HengXian)&& !(lastData instanceof topo.ShuXian)&& !(lastData instanceof topo.GuangZiPai)&& !(lastData instanceof topo.StatusButton)  && !(lastData instanceof topo.SkipButton) && !(lastData instanceof topo.IndexNode)) && lastData);
					 }
					 else{
						 return true;
					 }
				 }
				 if((menuItem.label == Msg.topocfg.cutout)){                //删除
					 if(nodeortpl || self.newConfSchemaObj.schemeTypeId == 11){         //单�?
						 return !((lastData instanceof twaver.Grid) && !(lastData instanceof topo.Shelf23) && !(lastData instanceof topo.Shelf24) && !(lastData instanceof topo.Shelf22)&& !(lastData instanceof topo.JZZuChuan)&& !(lastData instanceof topo.Table)&& !(lastData instanceof topo.HengXian)&& !(lastData instanceof topo.ShuXian)&& !(lastData instanceof topo.GuangZiPai) && !(lastData instanceof topo.StatusButton)  && !(lastData instanceof topo.SkipButton) && !(lastData instanceof topo.IndexNode)) && lastData;
					 }
					 else{
						 return false;
					 }
				 }

				 if(menuItem.label == Msg.topocfg.associateotherstation ){	//关联其他站
					 var deviceID = lastData.getClient("deviceid");
					 var relationEMI = lastData.getClient("relationKeyId");
					 //核查是否是分布式电站
					 //var falg=topo.Util.isdistribute();
					 if(distribute){
					 if(!ifmutiple && nodeortpl  && nodetypeid == 21 ){
						 if( deviceID!=undefined  && relationEMI == undefined){
							return false;
						 }else{
							 return  true;
						 }
					 }else{
						return false;
					 	}
					 }else{
						 return false
					 }
				 }
				 if(menuItem.label == Msg.topocfg.bindCalcSignal) {
                     if(!ifmutiple && nodeortpl) {
                         return nodetypeid == 7;
                     }
                     return false;
				 }
			 }
			 else{                                                      //没有选中任何节点情况
				 if((menuItem.label == Msg.topocfg.paste)){
					 if(copyflag && (self.parentTreeNodeId !=0) && nodeortpl){     
						 return true;
					 }
					 else{
						 if (self.newConfSchemaObj.schemeTypeId == 11) {
							return true;
						}
						 return false;
					 }
				 }
				 else{
					 return false;
				 }
			 }
		};
		
		self.popupMenu.isEnabled = function (menuItem) {                                             //设置右键菜单菜单项是否可�?
			return true;
        };
    }
});
/**
 * 获取当前子阵的所有集中式逆变器
 * @param lastData
 * @param self
 * @param selectionId
 */
function getCurrentArrInvs(lastData, self, selectionId){
	var deviceid = lastData.getClient("deviceid");
	
	var ConfSchemaInfo = {};
	ConfSchemaInfo.id = self.curConfSchemaObj.busiObjectId;
	
	var parentdevid = -1;
	var parentdevName = "";
	$.omcAjax("/subarray/getParentDev", {"devId": deviceid},function (res) {
		
		var paretDev = res.data.parentDev;
		if(paretDev != null) {
			var parentdevid = paretDev.id;
			var parentdevName = paretDev.name;
		}else {
			var parentdevid = lastData.getClient("parentdevid");
			var parentdevName = lastData.getClient("parentdevName");
		}
		
		$.omcAjax("/cm/ConfSchemaInfo/getCurrentArrInvs",ConfSchemaInfo,function(data){
			if(data.success){
				var dataOptions = data.data;
				
				selectionId.html("");
				selectionId.append("<option value='' name='' selected></option"); // 增加一行空的select
		 		
				var size = dataOptions.length;
		 		for(var i = 0;i < size ;i++){
	 				var nameOption  = dataOptions[i].name;
	 				var idOption = dataOptions[i].id;
	 				
	 				if (deviceid){
	 					//更新
	 					if(parentdevName == nameOption){
	 						selectionId.append("<option value='"+idOption+"' selected >"+nameOption+"</option");
	 					}
	 					else{
	 						selectionId.append("<option value='"+idOption+"' >"+nameOption+"</option");
	 					}
	 				} else {
	 					//新增
	 					if(parentdevid == idOption){
	 	 					selectionId.append("<option value='"+idOption+"' selected >"+nameOption+"</option");
	 	 				}
	 	 				else{
	 	 					selectionId.append("<option value='"+idOption+"' >"+nameOption+"</option");
	 	 				}
	 				}
	 			}
			}else{ 
				selectionId.append("");
				return false;
			}
			$("#ascurinvstr").show();
		});
	});
}
/**
 * 获取当前子阵下的箱变
 * @param lastData
 * @param self
 * @param selectionId
 */
function getCurrentTwoArrInvs(lastData, self, selectionId){
	var deviceid = lastData.getClient("deviceid");
	
	var ConfSchemaInfo = {};
	ConfSchemaInfo.id = self.curConfSchemaObj.busiObjectId;
	
	var parentdevid = -1;
	var parentdevName = "";
	$.omcAjax("/subarray/getParentDev", {"devId": deviceid},function (res) {
		
		var paretDev = res.data.parentDev;
		if(paretDev != null) {
			var parentdevid = paretDev.id;
			var parentdevName = paretDev.name;
		}else {
			var parentdevid = lastData.getClient("parentdevid");
			var parentdevName = lastData.getClient("parentdevName");
		}
		
		$.omcAjax("/cm/ConfSchemaInfo/getCurrentTwoArrInvs",ConfSchemaInfo,function(data){
			if(data.success){
				var dataOptions = data.data;
				selectionId.html("");
				selectionId.append("<option value='' name='' selected></option"); // 增加一行空的select
		 		
				var size = dataOptions.length;
		 		for(var i = 0;i < size ;i++){
		 			var nameOption  = dataOptions[i].name;
	 				var idOption = dataOptions[i].id;
	 				
	 				if (deviceid){
	 					//更新
	 					if(parentdevName == nameOption){
	 						selectionId.append("<option value='"+idOption+"' selected >"+nameOption+"</option");
	 					}
	 					else{
	 						selectionId.append("<option value='"+idOption+"' >"+nameOption+"</option");
	 					}
	 				} else {
	 					//新增
	 					if(parentdevid == idOption){
	 	 					selectionId.append("<option value='"+idOption+"' selected >"+nameOption+"</option");
	 	 				}
	 	 				else{
	 	 					selectionId.append("<option value='"+idOption+"' >"+nameOption+"</option");
	 	 				}
	 				}
	 			}
			}else{ 
				selectionId.append("");
				return false;
			}
			$("#ascurinvstr_111").show();
		});
	});
}

function uploadUserPicSuc(fileFileName){
	demo.Util.registerImage("/module/topo/images/userimages/"+fileFileName,globleObjManager.network);
	$("#picPathSel").append("<option value='"+fileFileName+"' selected>"+fileFileName+"</option");
	$("#input_text").val("");
	$("#picPathSel").change();
}

function uploadUserPicRename(){
	/*$("#alertdlg").dialog({height:200});*/
	$("#alertmsg").html("");
    $("#alertmsg").html(Msg.topocfg.samefilenametip);              //图片同名
    $("#alertdlg").dialog("open");
}

function uploadUserPicLarge(){
	/*$("#alertdlg").dialog({height:200});*/
	$("#alertmsg").html("");
    $("#alertmsg").html(Msg.topocfg.filetoolargetip);              //图片太大
    $("#alertdlg").dialog("open");
}

//限制输入设备容量�?
function rlxz(){
	var rlVal = $("#inputDevCapacity").val();
	var reg = /^\d+$/; 
	if(reg.test(rlVal)){
		if(rlVal < 0){
			var rlVal = $("#inputDevCapacity").val("0");
		}
		if(400 < rlVal){
			var rlVal = $("#inputDevCapacity").val("400");
		}
	}
	else{
		var rlVal = $("#inputDevCapacity").val("0");
	}
}


	 
	