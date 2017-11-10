/**
 * @author wWX233311
 *
 */

topo = {};
topo.Util = {
	//清除TEXT节点相关属性
	clearNodeClient:function(textNode){
		textNode.setClient("signalcolname",null);
		textNode.setClient("signalid",null);
		textNode.setClient("signalname",null);
		textNode.setClient("signalunit",null);
		textNode.setClient("signaltype",null);
		textNode.setClient("schemaBindInfoID",null);
		textNode.setClient("deviceid",null);
		textNode.setClient("devicename",null);
		textNode.setClient("devProColName",null);
		textNode.setClient("devProName",null);
		textNode.setClient("devProId",null);
		textNode.setClient("texttype",null);
		textNode.setClient("hostnodename",null);
		textNode.setClient("hostnodeid",null);
		textNode.setClient("modelVersionName",null);
		textNode.setClient("modelVersionID",null);
		textNode.setClient("signalobject",null);
		textNode.setClient("signalkind",null);


	},	
		
		
	//两脚两脚箱变图元右键菜单"关联已有设备"可见
	isAssDevMenuVisibleForXB:function(nodetypeid,image){
		return ((nodetypeid == 13) && ((image == "sanxiangr") || (image == "liangxiangljr") 
				|| (image == "liangxiangsjr") || (image == "xbljzt1") || (image == "xbljzt2")|| (image == "xbljzt3")
				|| (image == "xbljzt4")|| (image == "xbsjzt1")|| (image == "xbsjzt2")|| (image == "xbsjzt3")
				|| (image == "xbsjzt4")|| (image == "xbsjzt5")));
	},
	
	//两脚两脚箱变图元右键菜单"关联已有设备"可见
	isAssDevVerMenuVisibleForXB:function(image){
		return ((image == "sanxiang3dr") || (image == "liangxiang3dljr") ||(image == "liangxiang3dsjr")
				|| (image == "xbljft1")|| (image == "xbljft2")|| (image == "xbljft3")|| (image == "xbljft4")
				|| (image == "xbsjft1")|| (image == "xbsjft2")|| (image == "xbsjft3")|| (image == "xbsjft4")
				|| (image == "xbsjft5"));
	},
	
	//是否显示图元名称（针对箱变分图）
	isShowName:function(image){
		return (image == "sanxiang3dr")||(image == "liangxiang3dljr") || (image == "liangxiang3dsjr")
				|| (image == "xbljft1")|| (image == "xbljft2")|| (image == "xbljft3")|| (image == "xbljft4")
				|| (image == "xbsjft1")|| (image == "xbsjft2")|| (image == "xbsjft3")|| (image == "xbsjft4")
				|| (image == "xbsjft5");
	},
	
	//是否显示版本名称（针对箱变分图和总图）
	isShowDevVerName:function(selectobj){
		return   (selectobj instanceof topo.SanXiang3D)|| (selectobj instanceof topo.LiangXiang3DLJ)|| (selectobj instanceof topo.LiangXiang3DSJ)
		       ||(selectobj instanceof topo.SanXiang) || (selectobj instanceof topo.LiangXiangLJ) || (selectobj instanceof topo.LiangXiangSJ)
		       ||(selectobj instanceof topo.XBLJFT1)||(selectobj instanceof topo.XBLJFT2)||(selectobj instanceof topo.XBLJFT3)||(selectobj instanceof topo.XBLJFT4)
		       ||(selectobj instanceof topo.XBLJZT1)||(selectobj instanceof topo.XBLJZT2)||(selectobj instanceof topo.XBLJZT3)||(selectobj instanceof topo.XBLJZT4)
		       ||(selectobj instanceof topo.XBSJFT1)||(selectobj instanceof topo.XBSJFT2)||(selectobj instanceof topo.XBSJFT3)||(selectobj instanceof topo.XBSJFT4)||(selectobj instanceof topo.XBSJFT5)
	           ||(selectobj instanceof topo.XBSJZT1)||(selectobj instanceof topo.XBSJZT2)||(selectobj instanceof topo.XBSJZT3)||(selectobj instanceof topo.XBSJZT4)||(selectobj instanceof topo.XBSJZT5);
	},
	
	//是否显示客户化标号（针对箱变总图）
	isShowDevName:function(selectobj){
		return (selectobj instanceof topo.SanXiang) || (selectobj instanceof topo.LiangXiangLJ) || (selectobj instanceof topo.LiangXiangSJ)
		       ||(selectobj instanceof topo.XBLJZT1)||(selectobj instanceof topo.XBLJZT2)||(selectobj instanceof topo.XBLJZT3)||(selectobj instanceof topo.XBLJZT4)
	           ||(selectobj instanceof topo.XBSJZT1)||(selectobj instanceof topo.XBSJZT2)||(selectobj instanceof topo.XBSJZT3)||(selectobj instanceof topo.XBSJZT4)||(selectobj instanceof topo.XBSJZT5);
	},

	isdistribute:function(){
		$.omcAjax("/cm/SchemaNodeBind/isdistribute",{}, function (data) {
			if(data.success){
				return data.data;
			}else{
				$("#alertmsg").html("");
				$("#alertmsg").html(Msg.topocfg.getStationInfoError);
				$("#alertdlg").dialog("open");
			}
		},false);
	},
		
	getUpLoadFileName:function(){
		var fileURL=$("#picUpLoadFile").val();
		var fileName='';
		if(fileURL!=''){
			 var all = fileURL.split('\\');
	         fileName=all[all.length-1];
		}
		$("#input_text").val(fileName);
	},
	
	/**
     * 设置客户属性类型
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
     * 选择交互
     */
	failTip:function(data,tipmsg){
		if(data.message){
			$("#alertmsg").html("");
			$("#alertmsg").html(data.message);
	        $("#alertdlg").dialog("open");
		}
		else if(data.params && data.params.length > 0){
			$("#alertmsg").html("");
			$("#alertmsg").html(data.params);
	        $("#alertdlg").dialog("open");
		}
		else{
			$("#alertmsg").html("");
			$("#alertmsg").html(tipmsg);
	        $("#alertdlg").dialog("open");
		}
	},
    
	/**
     * 节点拷贝
     */
    topoCopy :function(selectlisttemp,selectlist){
    	var self = this;
    	var listtemp = new twaver.List();
    	selectlisttemp.forEach(function(e){
    		if(e instanceof twaver.Link){
    			var linktemp = self.instanceObjByName(e);;
    			var fromnode = e.getFromNode();
				var tonode = e.getToNode();
    			if(!selectlisttemp.contains(fromnode) || !selectlisttemp.contains(fromnode)){   //连线不完整
    				
    			}
    			else{
        			if(!listtemp.contains(fromnode)){   //不包含起始节点
        				var copyfromnode = self.instanceObjByName(fromnode);    //copy
        				linktemp.setFromNode(copyfromnode);
        				selectlist.add(copyfromnode);
        				fromnode.setClient("assid",copyfromnode.getId());
        				listtemp.add(fromnode);
        			}
        			else{                               //包含的话
        				var assid = fromnode.getClient("assid");
        				var fromnodetemp = null;
        				selectlist.forEach(function(e){
        					if(e.getId() == assid){
        						fromnodetemp = e;
        					}
        					else{
        						
        					}
        				});
        				linktemp.setFromNode(fromnodetemp);
        				
        			}
        			if(!listtemp.contains(tonode)){   //不包含结束节点
        				var copytonode = self.instanceObjByName(tonode);
        				linktemp.setToNode(copytonode);
        				selectlist.add(copytonode);
        				tonode.setClient("assid",copytonode.getId())
        				listtemp.add(tonode);
        			}
        			else{
        				var assid = tonode.getClient("assid");
        				var tonodetemp = null;
        				selectlist.forEach(function(e){
        					if(e.getId() == assid){
        						tonodetemp = e;
        					}
        				});
        				linktemp.setToNode(tonodetemp);
        			}
        			selectlist.add(linktemp);
        			
    			}
    		} 
    	});
    	selectlisttemp.forEach(function(e){
    		if(!(e instanceof twaver.Link) && !((e instanceof twaver.Grid) && !(e instanceof topo.Shelf24) && !(e instanceof topo.Shelf23) && !(e instanceof topo.Shelf22)&& !(e instanceof topo.JZZuChuan)&& !(e instanceof topo.Table)&& !(e instanceof topo.HengXian)&& !(e instanceof topo.ShuXian)&& !(e instanceof topo.GuangZiPai) && !(e instanceof topo.StatusButton) && !(e instanceof topo.SkipButton) && !(e instanceof topo.IndexNode)) && e){

    			if(!listtemp.contains(e)){  
    				var nodetemp = self.instanceObjByName(e);
        			selectlist.add(nodetemp);
    			}
    		}
    		e.setClient("assid","");         
    	});
    },
    
    /**
     * 实例化对象
     */
    instanceObjByName :function(e){
    	var rtnobj = null;
    	if(e instanceof topo.NiBianQi){                       //逆变器
    		rtnobj =  new topo.NiBianQi();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.TongYong){
    		rtnobj =  new topo.TongYong();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.TGJ){                       //通关机
    		rtnobj =  new topo.TGJ();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.NiBianQi3D){                       //逆变器3d
    		rtnobj =  new topo.NiBianQi3D();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.JZNiBianQi){                       //集中式逆变器
    		rtnobj =  new topo.JZNiBianQi();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.JZNiBianQi3D){                       //集中式逆变器3d
    		rtnobj =  new topo.JZNiBianQi3D();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.JZXiangBian3D){                       //箱式变压器3d
    		rtnobj =  new topo.JZXiangBian3D();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.ZLHuiLiuXiang){                       //直流汇流箱
    		rtnobj =  new topo.ZLHuiLiuXiang();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.ZLHuiLiuXiang3D){                       //直流汇流箱3d
    		rtnobj =  new topo.ZLHuiLiuXiang3D();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.Shelf24){                           //组串24
    		rtnobj = new topo.Shelf24();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('grid.row.count', e.getStyle('grid.row.count'));
    		rtnobj.setStyle('grid.column.count', e.getStyle('grid.column.count'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.Shelf23){                           //组串23
    		rtnobj = new topo.Shelf23();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('grid.row.count', e.getStyle('grid.row.count'));
    		rtnobj.setStyle('grid.column.count', e.getStyle('grid.column.count'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.Shelf22){                           //组串22            
    		rtnobj = new topo.Shelf22();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('grid.row.count', e.getStyle('grid.row.count'));
    		rtnobj.setStyle('grid.column.count', e.getStyle('grid.column.count'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.JZZuChuan){                           //集中式组串            
    		rtnobj = new topo.JZZuChuan();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('grid.row.count', e.getStyle('grid.row.count'));
    		rtnobj.setStyle('grid.column.count', e.getStyle('grid.column.count'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.ZuChuan3D){                           //组串3D           
    		rtnobj = new topo.ZuChuan3D();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.Table){                           //表格          
    		rtnobj = new topo.Table();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('grid.row.count', e.getStyle('grid.row.count'));
    		rtnobj.setStyle('grid.column.count', e.getStyle('grid.column.count'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
			rtnobj.setStyle('grid.fill', e.getStyle("grid.fill"));
			rtnobj.setStyle('grid.fill.color', e.getStyle("grid.fill.color"));
			rtnobj.setStyle('grid.border', e.getStyle("grid.border"));
			rtnobj.setStyle('grid.deep', e.getStyle("grid.deep"));
			rtnobj.setStyle('grid.cell.deep', e.getStyle("grid.cell.deep"));
			rtnobj.setStyle('grid.padding', e.getStyle("grid.padding"));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.BusNode){                           //总线            
    		rtnobj = new topo.BusNode();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setSize(e.getSize().width,e.getSize().height);
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		/*rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());*/
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.ZiZhenXJ){                         //子阵 ，小机           
    		rtnobj = new topo.ZiZhenXJ();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.ZiZhen){                         //子阵             
    		rtnobj = new topo.ZiZhen();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.SanXiang){                       //三相           
    		rtnobj = new topo.SanXiang();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.XBSJZT1){                       
    		rtnobj = new topo.XBSJZT1();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBSJZT2){                       
    		rtnobj = new topo.XBSJZT2();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBSJZT3){                       
    		rtnobj = new topo.XBSJZT3();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBSJZT4){                       
    		rtnobj = new topo.XBSJZT4();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBSJZT5){                       
    		rtnobj = new topo.XBSJZT5();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.LiangXiangLJ){                   //两相，两脚     
    		rtnobj = new topo.LiangXiangLJ();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.LiangXiangSJ){                       //两相 ，三脚          
    		rtnobj = new topo.LiangXiangSJ();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.XBLJZT1){                       
    		rtnobj = new topo.XBLJZT1();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBLJZT2){                       
    		rtnobj = new topo.XBLJZT2();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBLJZT3){                       
    		rtnobj = new topo.XBLJZT3();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.XBLJZT4){                       
    		rtnobj = new topo.XBLJZT4();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(e instanceof topo.DuanLuQi){                       //断路器            
    		rtnobj = new topo.DuanLuQi();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.DuanLuQiZJX){                       //断路器            
    		rtnobj = new topo.DuanLuQiZJX();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.GeLiDaoZha){                     //隔离刀闸            
    		rtnobj = new topo.GeLiDaoZha();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.GuangZiPai){                     //光字牌             
    		rtnobj = new topo.GuangZiPai();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('vector.outline.color', e.getStyle('vector.outline.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.StatusButton){                     //电站状态         
    		rtnobj = new topo.StatusButton();
    		rtnobj.setStyle('body.type', e.getStyle('body.type'));
			rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('vector.outline.color', e.getStyle('vector.outline.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
			rtnobj.setSize(e.getSize().width,e.getSize().height);
    		
    	}
    	if(e instanceof topo.XiangBian){                      //箱变             
    		rtnobj = new topo.XiangBian();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.ShuJuCaiJiQi){                   //数采             
    		rtnobj = new topo.ShuJuCaiJiQi();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.JLHuiLiuXiang){                  //交流汇流箱             
    		rtnobj = new topo.JLHuiLiuXiang();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.JLHuiLiuXiang3D){                //交流汇流箱3D             
    		rtnobj = new topo.JLHuiLiuXiang3D();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.HuJingJianCeYi){                 //环境仪           
    		rtnobj = new topo.HuJingJianCeYi();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.SanXiang3D){                      //三相3D             
    		rtnobj = new topo.SanXiang3D();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBSJFT1){                              
    		rtnobj = new topo.XBSJFT1();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBSJFT2){                              
    		rtnobj = new topo.XBSJFT2();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBSJFT3){                              
    		rtnobj = new topo.XBSJFT3();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBSJFT4){                              
    		rtnobj = new topo.XBSJFT4();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBSJFT5){                              
    		rtnobj = new topo.XBSJFT5();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.LiangXiang3DLJ){                      //两相3D，两脚             
    		rtnobj = new topo.LiangXiang3DLJ();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.LiangXiang3DSJ){                      //两相3D ，三脚            
    		rtnobj = new topo.LiangXiang3DSJ();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBLJFT1){                       
    		rtnobj = new topo.XBLJFT1();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBLJFT2){                       
    		rtnobj = new topo.XBLJFT2();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBLJFT3){                       
    		rtnobj = new topo.XBLJFT3();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XBLJFT4){                       
    		rtnobj = new topo.XBLJFT4();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.DuanLuQi3D){                       //断路器3D             
    		rtnobj = new topo.DuanLuQi3D();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle("label.color"));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.SkipButton){                       //跳转按钮             
    		rtnobj = new topo.SkipButton();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('vector.outline.color', e.getStyle('vector.outline.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		/*rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());*/
    		/*rtnobj.setAngle(e.getAngle());*/
    		rtnobj.setName(e.getName());
    		rtnobj.setSize(e.getSize().width,e.getSize().height);
    	}
    	if(e instanceof topo.IndexNode){                       //索引节点             
    		rtnobj = new topo.IndexNode();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('vector.outline.color', e.getStyle('vector.outline.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		/*rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());*/
    		/*rtnobj.setAngle(e.getAngle());*/
    		rtnobj.setName(e.getName());
    		rtnobj.setSize(e.getSize().width,e.getSize().height);
    	}
    	if(e instanceof topo.circleChart){                       //曲线图    
    		rtnobj = new topo.circleChart();
			rtnobj.setLocation(e.getLocation());
			rtnobj.setStyle('component.fillcolor', e.getStyle('component.fillcolor'));
			rtnobj.setStyle('component.position', e.getStyle('component.position'));
			rtnobj.setStyle('component.direction', e.getStyle('component.direction'));
			rtnobj.setStyle('component.pointer.length', e.getStyle('component.pointer.length'));
			rtnobj.setStyle('component.pointer.width', e.getStyle('component.pointer.width'));
			rtnobj.setStyle('component.width',  e.getStyle('component.width'));
			rtnobj.setStyle('component.height', e.getStyle('component.height'));
			rtnobj.setStyle('circleChart.color', e.getStyle('circleChart.color'));
			
			rtnobj.lineChart.getView().style.width = e.getStyle('component.width')+"px";//这种曲线图宽度
			rtnobj.lineChart.getView().style.height = e.getStyle('component.height')+"px";//这种曲线图高度
			rtnobj.lineChart.getDataBox()._dataList.forEach(function(datas) {
        		 datas.setStyle('chart.color',e.getStyle('circleChart.color'));
        	 });
		}
    	if(e instanceof topo.PT){                               //PT             
    		rtnobj = new topo.PT();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.ImageNode){                        //图片             
    		rtnobj = new topo.ImageNode();
    		rtnobj.setClient("picpath",e.getClient("picpath"));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    		rtnobj.setImage(e.getImage());
    	}
    	if(e instanceof topo.JieDiKaiGuanZuo){                  //接地开关（左）             
    		rtnobj = new topo.JieDiKaiGuanZuo();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.JieDiKaiGuanYou){                    //接地开关（右）             
    		rtnobj = new topo.JieDiKaiGuanYou();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.GeLiDaoZhaShang){                   //隔离刀闸（上）             
    		rtnobj = new topo.GeLiDaoZhaShang();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.GeLiDaoZhaXia){                     //隔离刀闸（下）             
    		rtnobj = new topo.GeLiDaoZhaXia();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.ShangJianTou){                     //箭头（上）             
    		rtnobj = new topo.ShangJianTou();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.XiaJianTou){                     //箭头（下）             
    		rtnobj = new topo.XiaJianTou();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	if(e instanceof topo.DianBiao){                     //箱变电表             
    		rtnobj = new topo.DianBiao();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.gkDianBiao){                     //关口电表             
    		rtnobj = new topo.gkDianBiao();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.hjzDianBiao){                     //汇集站线路电表             
    		rtnobj = new topo.hjzDianBiao();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.cydFactoryDianBiao){                     //厂用生产区电电表             
    		rtnobj = new topo.cydFactoryDianBiao();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.cydFactoryNonDianBiao){                     //厂用非生产区电电表             
    		rtnobj = new topo.cydFactoryNonDianBiao();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		/*rtnobj.setName(e.getName());*/
    	}
    	if(e instanceof topo.NiBianQiKaiGuan){               //逆变器开关             
    		rtnobj = new topo.NiBianQiKaiGuan();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	
    	if(e instanceof topo.Text){                           //Text             
    		rtnobj = new topo.Text();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	
    	if(e instanceof topo.DiXianYou){               //地线右           
    		rtnobj = new topo.DiXianYou();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	
    	if(e instanceof topo.DiXianZuo){               //地线左                      
    		rtnobj = new topo.DiXianZuo();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setAngle(e.getAngle());
    		rtnobj.setName(e.getName());
    	}
    	
    	if(e instanceof topo.HengXian){               //横线                      
    		rtnobj = new topo.HengXian();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	
    	if(e instanceof topo.ShuXian){               //竖线                    
    		rtnobj = new topo.ShuXian();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	
    	if(e instanceof topo.ShapeNode){               //不规则节点     
    		rtnobj = new topo.ShapeNode();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('vector.shape', e.getStyle('vector.shape'));
    		rtnobj.setStyle('vector.fill.color', e.getStyle('vector.fill.color'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setPoints(e.getPoints());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.PowerRegulation){                     //功率调节          
    		rtnobj = new topo.PowerRegulation();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		//rtnobj.setName(e.getName());
    	}
		
		if(e instanceof topo.pidTopo){                     //PID          
    		rtnobj = new topo.pidTopo();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
		
		if(e instanceof topo.pidTopo3D){                     //PID          
    		rtnobj = new topo.pidTopo3D();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
    	
		if(e instanceof topo.BiLeiZhen){                                         
    		rtnobj = new topo.BiLeiZhen();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.DaiDianZZ){                                         
    		rtnobj = new topo.DaiDianZZ();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.DianRong){                                         
    		rtnobj = new topo.DianRong();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.DianKang){                                         
    		rtnobj = new topo.DianKang();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.FLDianKang){                                         
    		rtnobj = new topo.FLDianKang();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.DianGan){                                         
    		rtnobj = new topo.DianGan();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.ShouChe){                                 
    		rtnobj = new topo.ShouChe();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.YuanKong){                      
    		rtnobj = new topo.YuanKong();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    		rtnobj.setName(e.getName());
    	}
		if(e instanceof topo.TongYong){
    		rtnobj =  new topo.TongYong();
    		rtnobj.setLocation(e.getLocation());
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.font', e.getStyle('label.font'));
    		rtnobj.setWidth(e.getWidth());
    		rtnobj.setHeight(e.getHeight());
    	}
    	if(!(e instanceof twaver.Link) && !((e instanceof twaver.Grid) && 
    			!(e instanceof topo.Shelf23) && !(e instanceof topo.Shelf22)&& !(e instanceof topo.Shelf24) && 
    			!(e instanceof topo.JZZuChuan)&& !(e instanceof topo.Table)&& 
    			!(e instanceof topo.HengXian)&& !(e instanceof topo.ShuXian)&& 
    			!(e instanceof topo.GuangZiPai) && !(e instanceof topo.SkipButton) &&
    			!(e instanceof topo.IndexNode) && !(e instanceof topo.StatusButton))  && e){
	    	rtnobj.setClient('nodetypeid', e.getClient('nodetypeid'));
			rtnobj.setClient('nodetypename', e.getClient('nodetypename'));
    	}
		
		if(e instanceof twaver.Link){                             //连线             
    		rtnobj = new twaver.Link();
    		rtnobj.setStyle('label.xoffset', e.getStyle('label.xoffset'));
    		rtnobj.setStyle('label.yoffset', e.getStyle('label.yoffset'));
    		rtnobj.setStyle('label.color', e.getStyle('label.color'));
    		rtnobj.setStyle('label.position', e.getStyle('label.position'));
    		rtnobj.setStyle('link.color', e.getStyle('link.color'));
    		rtnobj.setStyle('link.width', e.getStyle('link.width'));
    		rtnobj.setStyle('link.type', e.getStyle('link.type')); 
    		rtnobj.setStyle('link.from.xoffset', e.getStyle('link.from.xoffset')); 
    		rtnobj.setStyle('link.from.yoffset', e.getStyle('link.from.yoffset')); 
    		rtnobj.setStyle('link.to.xoffset', e.getStyle('link.to.xoffset')); 
    		rtnobj.setStyle('link.to.yoffset', e.getStyle('link.to.yoffset')); 
    		rtnobj.setStyle('link.corner',  e.getStyle('link.corner'));
    		rtnobj.setStyle('link.extend',  e.getStyle('link.extend'));
    		rtnobj.setName(e.getName());
    	}
		
		
    	return rtnobj;
    },
    
		
	registerImage : function(url) {
		demo.Util.registerImage(url);
	},
	
    /**
     * 注册图片
     * */
	registImages : function() {   
		this.registerImage("/module/topo/images/toponodeicon/tongyong.png");
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
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt3.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljft1.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt1.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljft2.png");
    	this.registerImage("/module/topo/images/toponodeicon/xbljzt2.png");
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
	},	
	
	/**
	 * 根据图元类型找到可用网元设备
	 */
	getAssociatedDevice:function(nodeTypeId){
		 $.omcAjax("/cm/SchemaNodeBind/getUnbindDevs", {
     		"pelTypeId" : nodeTypeId
     		}, function(data) {
     			 if(data.success == false){
     				 /*$("#alertdlg").dialog({height:180});*/
     				 topo.Util.failTip(data,Msg.topocfg.getunbingdevfail);                               //获取未绑定设备失败
     				 return false;
     			 }
     			 if(data.success == true){
     				var flag = topo.Util.appendToSelection(data.data,$("#choosedev"));
     				if(flag == false){
     					return false;
     				}
     				else{
     					$("#choosedevdlg").dialog("open");
     				}
     			 }
     	});
	},
	
	
	/**
	 * 根据类型得到所有可用设备
	 */
	getDevsByType:function(nodeTypeId,deviceid){
		 $.omcAjax("/cm/SchemaNodeBind/getbindableDevs", {
     		"pelTypeId" : nodeTypeId
     		}, function(data) {
     			 if(data.success == false){
     				 /*$("#alertdlg").dialog({height:180});*/
     				 topo.Util.failTip(data,Msg.topocfg.getdevlistfail);
     				 return false;
     			 }
     			 if(data.success == true){
     				var flag = topo.Util.appendDevInfoToSelection(data.data,$("#choosedev"),"devinfo",deviceid);
     				if(flag == false){
     					return false;
     				}
     				else{
     					$("#choosedevdlg").dialog("open");
     				}
     			 }
     	});
	},

	/**
	 * 根据图元类型得到所有设备
	 */
	getAllDevsBypelType:function(nodeTypeId,deviceid){
		$.omcAjax("/cm/SchemaNodeBind/getbindableDevs", {
			"pelTypeId" : nodeTypeId
		}, function(data) {
			if(data.success == false){
				/*$("#alertdlg").dialog({height:180});*/
				topo.Util.failTip(data,Msg.topocfg.getdevlistfail);
				return false;
			}
			if(data.success == true){

				var flag = topo.Util.appendDevInfoToSelection(data.data,$("#otherEMIdev"),"devinfo",deviceid);

				if(flag == false){
					return false;
				}
				else{
					$("#otherEMIdevdlg").dialog("open");
				}
			}
		});
	},
	
	/**
	 * 根据类型得到所有未绑定的设备
	 */
	getNotBindDevsByType:function(nodeTypeId,deviceid){
		 $.omcAjax("/cm/SchemaNodeBind/getUnbindDevs", {
     		"pelTypeId" : nodeTypeId
     		}, function(data) {
     			 if(data.success == false){
     				 /*$("#alertdlg").dialog({height:180});*/
     				 topo.Util.failTip(data,Msg.topocfg.getunbingdevfail);    //获取未绑定设备失败     
     				 return false;
     			 }
     			 if(data.success == true){
     				var flag = topo.Util.appendDevInfoToSelection(data.data,$("#choosedev"),"devinfo",deviceid);
     				if(flag == false){
     					return false;
     				}
     				else{
     					$("#choosedevdlg").dialog("open");
     				}
     			 }
     	});
	},
	
	/**
	 * 关联可用设备，建立绑定关系
	 */
	assAvailDev:function(bindInfo, selectednode, obj){
		$.omcAjax("/cm/SchemaNodeBind/save", bindInfo, function (data) {
			if(data.success == false){
				/*$("#alertdlg").dialog({height:180});*/
				if (data.message != null){
					topo.Util.failTip(data, data.message); // 设备已经被关联
				} else{
					topo.Util.failTip(data, Msg.topocfg.associatefail);  	//  关联失败
				}
				return false;
			}
			if(data.success == true){
				var deviceid = $("#choosedev").val().split("@@")[0]                                     //设备ID
				$.omcAjax("/cm/dev/information",{"devID":deviceid}, function (data) {                   //更新
					if (data.success == false){
						/*$("#alertdlg").dialog({height:180});*/
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.getnodevinfo);                                 //没有取到设备信息
						$("#alertdlg").dialog("open");
						return false;
					}
					if(data.success == true){
						selectednode.setClient("bussinessCode",data.data.busiCode);                 //回写信息
						selectednode.setClient("name",data.data.name);
						selectednode.setClient("ip",data.data.ip);
						selectednode.setClient("ESN",data.data.ESN);
						selectednode.setClient("secondaddress",data.data.protocolAddr);
						selectednode.setName(data.data.name);
						selectednode.setClient("modelVersionID",data.data.modelVersionId);
						selectednode.setClient("deviceid",data.data.id);
						selectednode.setClient("devicename",data.data.busiCode);
						selectednode.setClient("kksCode",data.data.kksCode);
						selectednode.setClient("parentdevid", data.data.elecParentId);//保存电气父设备的id
						
						if(selectednode.getClient("nodetypeid") == 15){                              //箱变
							selectednode.setClient("highvswitch", data.data.highVSwitch);
							selectednode.setClient("lowvcircuitbreaker1", data.data.lowVCircuitBreaker1);
							selectednode.setClient("lowvcircuitbreaker2", data.data.lowVCircuitBreaker2);
						}
						var nodetypeid = selectednode.getClient("nodetypeid");
						var modelVersionID = data.data.modelVersionId;                                  //版本ID
						var objInfo = {pelTypeID: nodetypeid};
						$.omcAjax("/cm/dev/types", objInfo, function (data) {
							$("#modelVersionID").attr("disabled", false);
							if (data.success == false){
								/*$("#alertdlg").dialog({height:180});*/
								$("#alertmsg").html("");
								$("#alertmsg").html(Msg.topocfg.getdevverfail);                       //获取版本失败
								$("#alertdlg").dialog("open");
								return false;
							}
							if(data.success == true){
								$("#modelVersionID").attr("disabled", false);
								var size = data.data.length;
								var tempnodetypeid = selectednode.getClient("nodetypeid");
								if(size == 0 && tempnodetypeid!=69){
									/*$("#alertdlg").dialog({height:180});*/
									$("#alertmsg").html("");
									$("#alertmsg").html(Msg.topocfg.noavaildevver);              //没有可用设备版本
									$("#alertdlg").dialog("open");
									return false;
								}
								else{
									var dataOptions = data.data;
									for(var i = 0;i < size ;i++){
										var nameOption  = dataOptions[i].name;
										var idOption = dataOptions[i].id;
										if(modelVersionID == idOption){
											selectednode.setClient("modelVersionName",nameOption);        //主要是为了取设备版本
											break;
										}
									}
									
									if (nodetypeid == 44){
										//关联逆变器(youtao add)
										var deviceid = selectednode.getClient("deviceid");
										bindInfo.devID = deviceid;
										$.omcAjax("/cm/dev/updateDevById", bindInfo, function (data) {    //阳光化，绑定设备
											if (data.success == true ) {
												selectednode.setClient("parentdevid", bindInfo.parentDevID);
												selectednode.setClient("parentdevName", bindInfo.parentDevName);
												if(bindInfo.parentDevID){
													 var idFinder = new twaver.QuickFinder(obj.box,"deviceid","client",function(e){
													 },function(e){
														if(e instanceof topo.JZNiBianQi){
															var deviceid = e.getClient("deviceid");
															return (deviceid == bindInfo.parentDevID);
														}else{
															return false;
														}
													 });
													 var devhostnode = idFinder.find(bindInfo.parentDevId).get(0); 
													 if(devhostnode && (devhostnode instanceof topo.JZNiBianQi) && (selectednode instanceof topo.ZLHuiLiuXiang)){
														 selectednode.setHost(devhostnode);
													 }
												}else{
													 if(selectednode instanceof topo.ZLHuiLiuXiang){
														 selectednode.setHost(undefined);
													 }
												}
											}
										},false);
									}
									if(nodetypeid = 15){  //箱变
										var deviceid = selectednode.getClient("deviceid");
										bindInfo.devID = deviceid;
										//bindInfo.parentDevID = $("#ascurinvs_associate1").val();
										$.omcAjax("/cm/dev/updateDevById", bindInfo, function (data) {    //阳光化，绑定设备
											if (data.success == true ) {
												selectednode.setClient("parentdevid", bindInfo.parentDevID);
												selectednode.setClient("parentdevName", bindInfo.parentDevName);
//												if(bindInfo.parentDevID){
//													 var idFinder = new twaver.QuickFinder(obj.box,"deviceid","client",function(e){
//													 },function(e){
//														if(e instanceof topo.XiangBian){
//															var deviceid = e.getClient("deviceid");
//															return (deviceid == bindInfo.parentDevID);
//														}else{
//															return false;
//														}
//													 });
//													 var devhostnode = idFinder.find(bindInfo.parentDevId).get(0); 
//													 if(devhostnode && (devhostnode instanceof topo.XiangBian) && (selectednode instanceof topo.JZNiBianQi)){
//														 selectednode.setHost(devhostnode);
//													 }
//												}else{
//													 if(selectednode instanceof topo.JZNiBianQi){
//														 selectednode.setHost(undefined);
//													 }
//												}
											}
										},false);
									}
									
									var ConfSchemaInfo = {};
									ConfSchemaInfo.schemaData = obj.getTopoXmlData();
									ConfSchemaInfo.busiObjectId = obj.curConfSchemaObj.busiObjectId;
									ConfSchemaInfo.schemeTypeId = obj.curConfSchemaObj.schemeTypeId;
									ConfSchemaInfo.id = obj.curConfSchemaObj.id;

									$.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
										if (data.success == false) {
											/*$("#alertdlg").dialog({height:180});*/
											$("#alertmsg").html("");
											$("#alertmsg").html(Msg.topocfg.updatetopofail);             //更新拓扑图失败
											$("#alertdlg").dialog("open");
											return false;
										}
										else {
											$( "#choosedevdlg" ).dialog("close");
											obj.curConfSchemaObj.schemaData = obj.getTopoXmlData();
											obj.curConfSchemaObj.timeStamp = data.data.timeStamp;
											/*$("#alertdlg").dialog({height:180});*/
											$("#alertmsg").html("");
											$("#alertmsg").html(Msg.topocfg.savesuccess);               //保存成功
											$("#alertdlg").dialog("open");
										}
									});

								}
							}
						});
					}
				});
			}
		});
	},
	/**
	 * 关联其他站
	 */
	addOtherEMI:function(bindInfo,selectednode,obj){
		var isnewrelationKeyId = selectednode.getClient("relationKeyId");
		if(isnewrelationKeyId){
			bindInfo.id=isnewrelationKeyId;
		}
		$.omcAjax("/cm/SchemaNodeBind/save", bindInfo, function (data) {
			if(data.success == false){
				topo.Util.failTip(data,Msg.topocfg.associatefail);  	//  关联失败
				return false;
			}
			if(data.success == true){
				var relationKeyId = data.data.id;
				var deviceid = $("#otherEMIdev").val().split("@@")[0]                                     //设备ID
				$.omcAjax("/cm/dev/information",{"devID":deviceid}, function (data) {                   //更新
					if (data.success == false){
						/*$("#alertdlg").dialog({height:180});*/
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.getnodevinfo);                                 //没有取到设备信息
						$("#alertdlg").dialog("open");
						return false;
					}
					if(data.success == true){
						selectednode.setClient("bussinessCode",data.data.busiCode);                 //回写信息
						selectednode.setClient("name",data.data.name);
						selectednode.setClient("ip",data.data.ip);
						selectednode.setClient("ESN",data.data.ESN);
						selectednode.setClient("secondaddress",data.data.protocolAddr);
						selectednode.setName(data.data.name);
						selectednode.setClient("modelVersionID",data.data.modelVersionId);
						selectednode.setClient("deviceid",data.data.id);
						selectednode.setClient("devicename",data.data.busiCode);
						selectednode.setClient("kksCode",data.data.kksCode);
						selectednode.setClient("parentdevid", data.data.elecParentId);//保存电气父设备的id
						selectednode.setClient("relationKeyId", relationKeyId);//保存引用的主键
						selectednode.setClient("devicePort",data.data.port);
						var nodetypeid = selectednode.getClient("nodetypeid");
						var modelVersionID = data.data.modelVersionId;                                  //版本ID
						var objInfo = {pelTypeID: nodetypeid};
						$.omcAjax("/cm/dev/types", objInfo, function (data) {
							$("#modelVersionID").attr("disabled", false);
							if (data.success == false){
								$("#alertmsg").html("");
								$("#alertmsg").html(Msg.topocfg.getdevverfail);                       //获取版本失败
								$("#alertdlg").dialog("open");
								return false;
							}
							if(data.success == true){
								$("#modelVersionID").attr("disabled", false);
								var size = data.data.length;
								if(size == 0){
									$("#alertmsg").html("");
									$("#alertmsg").html(Msg.topocfg.noavaildevver);              //没有可用设备版本
									$("#alertdlg").dialog("open");
									return false;
								}
								else{
									var dataOptions = data.data;
									for(var i = 0;i < size ;i++){
										var nameOption  = dataOptions[i].name;
										var idOption = dataOptions[i].id;
										if(modelVersionID == idOption){
											selectednode.setClient("modelVersionName",nameOption);        //主要是为了取设备版本
											break;
										}
									}
									var ConfSchemaInfo = {};
									ConfSchemaInfo.schemaData = obj.getTopoXmlData();
									ConfSchemaInfo.busiObjectId = obj.curConfSchemaObj.busiObjectId;
									ConfSchemaInfo.schemeTypeId = obj.curConfSchemaObj.schemeTypeId;
									ConfSchemaInfo.id = obj.curConfSchemaObj.id;

									$.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
										if (data.success == false) {
											$("#alertmsg").html("");
											$("#alertmsg").html(Msg.topocfg.updatetopofail);             //更新拓扑图失败
											$("#alertdlg").dialog("open");
											return false;
										}
										else {
											$( "#otherEMIdevdlg" ).dialog("close");
											obj.curConfSchemaObj.schemaData = obj.getTopoXmlData();
											obj.curConfSchemaObj.timeStamp = data.data.timeStamp;
											$("#alertmsg").html("");
											$("#alertmsg").html(Msg.topocfg.savesuccess);               //保存成功
											$("#alertdlg").dialog("open");
										}
									});

								}
							}
						});
					}
				});
			}
		});
	},
	/**
	 * 增加设备信息option到selection
	 * */
	appendDevInfoToSelection:function(dataOptions,selectElement,name,deviceid){
    	 selectElement.html("");
  		 var size = dataOptions.length;
  		 if(size == 0){
  			 /*$("#alertdlg").dialog({height:180});*/
  			 $("#alertmsg").html("");
  			 $("#alertmsg").html(Msg.topocfg.noavailinfo);                                //没有可用信息
             $("#alertdlg").dialog("open");
  			 return false;
  		 }
  		 else{
  			 selectElement.html();
  			 for(var i = 0;i < size ;i++){
  				 var nameOption  = App.escapseHtml(dataOptions[i].name);
  				 var idOption = dataOptions[i].id;
  				 var modelVersionId = dataOptions[i].modelVersionId;
  				 if(deviceid){
  					 if(deviceid == idOption){
  						 selectElement.append("<option value='"+idOption+"@@"+modelVersionId+"' name='"+name+"' selected>"+nameOption+"</option");
  					 }
  					 else{
  						 selectElement.append("<option value='"+idOption+"@@"+modelVersionId+"' name='"+name+"' >"+nameOption+"</option");
  					 }
  				 }
  				 else{
  					selectElement.append("<option value='"+idOption+"@@"+modelVersionId+"' name='"+name+"'>"+nameOption+"</option");
  				 }
  			 }
  		 }	
    },

	/**
	 * 得到拓扑图
	 */
	getTopoGraphs:function(bindInfo,nodetypeid,topographid){
		if(nodetypeid == 4){                                                         //子阵仅获取子阵分图类型
			$.omcAjax("/cm/ConfSchemaInfo/getChildSchema", bindInfo, function(data) {
					 if(data.success == false){
						 /*$("#alertdlg").dialog({height:180});*/
						 $("#alertmsg").html("");
						 $("#alertmsg").html(Msg.topocfg.getmatrixtopolistfial);                //获取子阵分图列表失败
			             $("#alertdlg").dialog("open");
						 return false;
					 }
					 if(data.success == true){
						 var flag = topo.Util.appendTopoGraphsToSelection(data.data,$("#selectedTopoGraph"),topographid);
							if(flag == false){
								return false;
							}
					     	$("#dlgChoTopoGraph").dialog("open");
					 }
			 });
		} else if (nodetypeid == 51) {
			$.omcAjax("/cm/ConfSchemaInfo/getSubmatrixSchema", bindInfo, function(data) {
				 if(data.success == false){
					 /*$("#alertdlg").dialog({height:180});*/
					 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.getmatrixtopolistfial);                //获取子阵分图列表失败
		             $("#alertdlg").dialog("open");
					 return false;
				 }
				 if(data.success == true){
					 var flag = topo.Util.appendTopoGraphsToSelection(data.data,$("#selectedTopoGraph"),topographid);
						if(flag == false){
							return false;
						}
				     	$("#dlgChoTopoGraph").dialog("open");
				 }
		 });
		} else if (nodetypeid == 68) {
			$.omcAjax("/stationStatus/getCollectCenter", bindInfo, function(data) {
				 if(data.success == false){
					 /*$("#alertdlg").dialog({height:180});*/
					 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.getMainElelistfial);                //获取子阵分图列表失败
		             $("#alertdlg").dialog("open");
					 return false;
				 }
				 if(data.success == true){
					 var flag = topo.Util.appendTopoGraphsToSelection(data.data,$("#selectedTopoGraph"),topographid);
						if(flag == false){
							return false;
						}
				     	$("#dlgChoTopoGraph").dialog("open");
				 }
		  });
		} else{                                                                        //跳转按钮，所有拓扑图
			$.omcAjax("/cm/ConfSchemaInfo/getSkipableTopoNode",bindInfo, function(data) {
				 if(data.success == false){
					 /*$("#alertdlg").dialog({height:180});*/
					 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.gettopolistfail);          //获取拓扑图列表失败
		             $("#alertdlg").dialog("open");
					 return false;
				 }
				 if(data.success == true){
					 var flag = topo.Util.appendTopoGraphsToSelection(data.data,$("#selectedTopoGraph"),topographid);
						if(flag == false){
							return false;
						}
				     	$("#dlgChoTopoGraph").dialog("open");
				 }
			 });
		}
		
		
		
	},
	
	/**
	 * 获取当前子阵所创建逆变器
	 */
//	getCurrentArrInvs:function(bindInfo,nodetypeid,topographid){
//		if(nodetypeid == 44){                                                         //获取当前子阵的已有大机逆变器信息
//			console.info(nodetypeid);
//			/** 参数：子阵id */
//			$.omcAjax("/cm/ConfSchemaInfo/getCurrentArrInvs",bindInfo,function(data){
//				if(data.success){ 
//					var flag = topo.Util.appendInvsToSelection(data.data,$("#selectedInvsId"),topographid);
//					if(flag == false){
//						return false;
//					}
//			     	$("#dlgChoInvs").dialog("open");
//				}else{ 
//					$("#alertmsg").html("");
//					$("#alertmsg").html(Msg.topocfg.getcurinvsinfofail);          //获取逆变器列表失败
//		            $("#alertdlg").dialog("open");
//					return false;
//				}
//			});
//		}
//	},
	
	/**
	 * 增加可用拓扑图信息option到selection
	 * */
    appendTopoGraphsToSelection:function(dataOptions,selectElement,topographid){
    	 selectElement.html("");
  		 var size = dataOptions.length;
  		 if(size == 0){
  			 /*$("#alertdlg").dialog({height:180});*/
  			 $("#alertmsg").html("");
  			 $("#alertmsg").html(Msg.topocfg.noavailtopo);         //没有可用拓扑图
             $("#alertdlg").dialog("open");
  			 return false;
  		 }
  		 else{
  			 selectElement.html();
  			 for(var i = 0;i < size ;i++){
  				 var nameOption  = dataOptions[i].name;
  				 var idOption = dataOptions[i].topoId;
  				 if(topographid == idOption){
  					selectElement.append("<option value='"+idOption+"' selected >"+nameOption+"</option");
  				 }
  				 else{
  					selectElement.append("<option value='"+idOption+"' >"+nameOption+"</option");
  				 }
  			 }
  		 }	
    },
	
    /**
     * 增加可用逆变器信息option到selection
     */
    appendInvsToSelection:function(dataOptions,selectElement,topographid){
    	selectElement.html("");
 		 var size = dataOptions.length;
 		 if(size == 0){
 			 /*$("#alertdlg").dialog({height:180});*/
 			 $("#alertmsg").html("");
 			 $("#alertmsg").html(Msg.topocfg.noavailinvs);         //没有可用逆变器
             $("#alertdlg").dialog("open");
 			 return false;
 		 }
 		 else{
 			 selectElement.html();
 			 for(var i = 0;i < size ;i++){
 				 var nameOption  = dataOptions[i].name;
 				 var idOption = dataOptions[i].id;
 				 if(topographid == idOption){
 					selectElement.append("<option value='"+idOption+"' selected >"+nameOption+"</option");
 				 }
 				 else{
 					selectElement.append("<option value='"+idOption+"' >"+nameOption+"</option");
 				 }
 			 }
 		 }	
    },
    
	/**
	 * 寻找未阳光化的设备
	 */
	getNotSunDevice:function(){
		 $.omcAjax("/cm/dev/unbindingDev", {     //后台获取
     		}, function(data) {
     			 if(data.success == false){
     				 /*$("#alertdlg").dialog({height:180});*/
     				 $("#alertmsg").html("");
     				 $("#alertmsg").html(Msg.topocfg.getnotsundevfail);         //  获取未阳光化设备失败
		             $("#alertdlg").dialog("open");
     				 return false;
     			 }
     			 if(data.success == true){
     				topo.Util.fillingNotSunDeviceTable(data.data);
     			 }
     	});
	},
	
	
	
	
	/**
	 * 填充未阳光化的设备TABLE
	 */
	fillingNotSunDeviceTable:function(data){
		$("#sunArea").html('');
		for(var i = 0;i < data.length;i++){
			var trsun = $("<tr><td style='text-align:center;width:30%;'>"+data[i].devType+"</td><td style='text-align:center;width:25%;'>"+data[i].ESN+"</td>" +
					"<td style='text-align:center;width:30%;'>"+data[i].ip+"</td><td style='text-align:center;width:15%;'>"+data[i].protocolAddr+"</td></tr>");
			$("#sunArea").append(trsun);
		}
	},
	
	/**
	 * 根据设备ID得到设备信号(主图元直接关联)
	 * */
	getDeviceSignal:function(modelversionid){
		 var DevConmmonInfo = {};
		 DevConmmonInfo.modelVersionID = modelversionid;
		 DevConmmonInfo.token = "";
		 $.omcAjax("/cm/dev/signalModel", DevConmmonInfo, function(data) {
			 if(data.success == false){
				 /*$("#alertdlg").dialog({height:180});*/
				 topo.Util.failTip(data,Msg.topocfg.getsignalfail);  	//  获取信号失败
 				 return false;
 			 }
 			 if(data.success == true){
 				var flag = topo.Util.appendCheckBoxToDiv(data.data,$("#selectedSignal"),"hostnode");
 				if(flag == false){
 					return false;
 				}
 		     	$("#dlgChoDevSig").dialog("open");
 				
 			 }
     	});
	},
	
	/**
	 * 根据网元设备ID得到设备信号(从图元直接关联信号  组串)
	 * */
	getDeviceSignalTwo:function(modelversionid,lastData){
		 var DevConmmonInfo = {};
		 DevConmmonInfo.modelVersionID = modelversionid;
		 DevConmmonInfo.token = "";
		 $.omcAjax("/cm/dev/signalModel", DevConmmonInfo, function(data) {
			 if(data.success == false){
				 /*$("#alertdlg").dialog({height:180});*/
				 topo.Util.failTip(data,Msg.topocfg.getsignalfail);  	//  获取信号失败
				 return false;
			 }
			 if(data.success == true){
				//var flag = topo.Util.appendCheckBoxToDiv(data.data,$("#selectedSignal1"),"affixnode",lastData);    以前的方式
				 var flag = topo.Util.appendSelectToDiv(data.data,$("#selectedSignal1"),"affixnode",lastData); 
				if(flag == false){
					return false;
				}
				else{
					$("#dlgChoAssNode").dialog("open");
				}
				
			 }
    	});
	},
	
	/**
	 * 增加可用网元信号信息(主要针对组串)
	 * */
	appendSelectToDiv:function(dataOptions,divElement,name,lastData){
    	 divElement.html("");
    	 var signals = lastData.getClient("signalid");
    	 var nodetypeid = lastData.getClient("nodetypeid");
    	 var arrsignals = null;
    	 if(signals){
    		 arrsignals = signals.split(",");
    	 }
 		 var size = dataOptions.length;
 		 if(size == 0){
 			 divElement.css("margin-left","70px");
 			 divElement.css("margin-top","70px");
 			 divElement.html("<span class='text'>"+Msg.topocfg.dianbiaodeletetip+"</span>");
 		 }
 		 else{
 			 var nodedeviceid = lastData.getClient("deviceid");
			 var selectdeviceid = $("#selectedNode").val().split("@@")[0];
			 var strhtml = "";
			 divElement.css("margin-left","20px");
 			 divElement.css("margin-top","5px");
 			 var marchCount = 0;
 			 var optionSize = 0;
 			 if(6 == nodetypeid){
 				optionSize = 6;
 			 }
 			 else if(8 == nodetypeid){
 				optionSize = 4;
 			 }
 			 else{
 				optionSize = 8; 
 			 }
			 for(var j = 1 ; j <= optionSize ; j++){
				 var htmlTemp1 = "<div style='margin: 0px 0px 10px 10px;'>"+
			 					"<label ><span class='text'>"+Msg.topocfg.di+ j + Msg.topocfg.somesignal +"</span></label>"+
			 					"<select id='zcsignalopt"+ j +"' style='width:210px;height:23px;background-color:#001F41;color:#d8d8d8;border:1px solid #247ED3; margin: 0px 0px 0px 10px;'>"+
			 					"<option  value=''  selected  >"+Msg.topocfg.pleasechose+"</option>"+
			 					"</select>"+
							    "</div>";
				 divElement.append(htmlTemp1);
			 }
			 var optionHtml1 = "";
			 for( var k = 1 ; k <= optionSize ; k++ ){
				 var signalNameTemp = "PV" + k + Msg.topocfg.inputdianliu;
				 if(arrsignals && (nodedeviceid == selectdeviceid)){          //已经关联过
					for(var i = 0;i < size ;i++){
						var nameOption  = dataOptions[i].name;                  
						var colNameOption = dataOptions[i].colName;
						var idOption = dataOptions[i].id;
						var unitOption = dataOptions[i].metroUnit;
						var typeOption = dataOptions[i].dataTypeId;
						if(arrsignals[k-1] == idOption){                     //已经关联过就判断ID是否相等
						     optionHtml1 = optionHtml1 + "<option  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"'  selected  >"+nameOption+"</option>";
				        }
						else{
							 optionHtml1 = optionHtml1 + "<option  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"'   >"+nameOption+"</option>"; 
						}
						$("#zcsignalopt" + k).append(optionHtml1);
						optionHtml1 = "";
			        } 
				 }
				 else{                                                        //没有关联过
					for(var i = 0;i < size ;i++){
						var nameOption  = dataOptions[i].name;                  
						var colNameOption = dataOptions[i].colName;
						var idOption = dataOptions[i].id;
						var unitOption = dataOptions[i].metroUnit;
						var typeOption = dataOptions[i].dataTypeId;
						if(signalNameTemp == nameOption){
						     optionHtml1 = optionHtml1 + "<option  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"'  selected  >"+nameOption+"</option>";
				        }
						else{
							 optionHtml1 = optionHtml1 + "<option  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"'   >"+nameOption+"</option>"; 
						}
						$("#zcsignalopt" + k).append(optionHtml1);
						optionHtml1 = "";
			        }  
				 } 
			}
 	    }
   },
	
	/**
	 * 根据网元设备ID得到设备信号 （非组串）
	 * */
	getDeviceSignalThree:function(modelversionid,lastData,sigflag,devorver){
		 var DevConmmonInfo = {};
		 DevConmmonInfo.modelVersionID = modelversionid;
		 DevConmmonInfo.token = "";
		 $.omcAjax("/cm/dev/signalModel", DevConmmonInfo, function(data) {
			 if(data.success == false){
				 /*$("#alertdlg").dialog({height:180});*/
				 topo.Util.failTip(data,Msg.topocfg.getsignalfail);  	//  获取信号失败
				 return false;
			 }
			 if(data.success == true){
				var flag = topo.Util.appendRadioToDiv(data.data,$("#selectedSignal1"),lastData,sigflag,devorver);
				if(flag == false){
					return false;
				}
				else{
					$("#dlgChoAssNode").dialog("open");
				}
				
			 }
    	});
	},
	
	
	/**
	 * 根据设备ID得到设备属性
	 * */
	getDeviceInfo:function(lastData){
		 $.omcAjax("/cm/dev/propSignals", {"objKind":1}, function(data) {
			 if(data.success == false){
				 topo.Util.failTip(Msg.topocfg.getdecprofail);
				 return false;
			 }
			 if(data.success == true){
				topo.Util.appendDevInfoToDiv(data.data,$("#selectedDevInfo"),lastData);
				$("#relateDevInfo").dialog("open");
			 }
    	});
	},
	
	   
   /**
	 * 增加设备可用信息到radio
	 * */
   appendDevInfoToDiv:function(dataOptions,divElement,lastData){
   	     divElement.html("");
		 var size = dataOptions.length;
		 var strhtml = "";
		 var devProColName = lastData.getClient("devProColName");
		 if(size == 0){
 			 divElement.css("margin-left","70px");
 			 divElement.css("margin-top","120px");
 			 divElement.html("<span class='text'>"+Msg.topocfg.noconfigdevinfo+"</span>");
	 	 }
		 else{
			 divElement.css("margin-left","20px");
 			 divElement.css("margin-top","5px");
			 for(var i = 0;i < size ;i++){
				 var nameOption  = dataOptions[i].signName;
				 var colNameOption = dataOptions[i].objectColName;
				 var idOption = dataOptions[i].id;
				 if(devProColName && (devProColName == colNameOption)){
					 strhtml = strhtml + "<label ><input type='radio' name='devProInfo' value='"+colNameOption+"@@"+nameOption+"@@"+idOption+"' checked />"+nameOption+"</label>";
					 strhtml = strhtml + "<br/>";
				 }
				 else{
					 strhtml = strhtml + "<label ><input type='radio' name='devProInfo'  value='"+colNameOption+"@@"+nameOption+"@@"+idOption+"' />"+nameOption+"</label>";
					 strhtml = strhtml + "<br/>";
				 }
			 }
			 divElement.html(strhtml);
		 }
  },
	
	
	/**
	 * 增加可用网元信息option到selection
	 * */
    appendToSelection:function(dataOptions,selectElement,name){
    	 selectElement.html("");
  		 var size = dataOptions.length;
  		 if(size == 0){
  			 /*$("#alertdlg").dialog({height:180});*/
  			 $("#alertmsg").html("");
  			 $("#alertmsg").html(Msg.topocfg.noavailinfo);                        //没有可用信息
             $("#alertdlg").dialog("open");
  			 return false;
  		 }
  		 else{
  			 selectElement.html();
  			 for(var i = 0;i < size ;i++){
  				 var nameOption  = dataOptions[i].name;
  				 var idOption = dataOptions[i].id;
  				 selectElement.append("<option value='"+idOption+"' name='"+name+"'>"+nameOption+"</option");
  			 }
  		 }	
    },
    
    /**
	 * 增加可用网元信号信息<input type="checked">
	 * */
    appendCheckBoxToDiv:function(dataOptions,divElement,name,lastData){
    	 divElement.html("");
    	 var signals = lastData.getClient("signalid");
    	 var nodetypeid = lastData.getClient("nodetypeid");
    	 var arrsignals = null;
    	 if(signals){
    		 arrsignals = signals.split(",");
    	 }
 		 var size = dataOptions.length;
 		 if(size == 0){
 			 divElement.css("margin-left","70px");
 			 divElement.css("margin-top","70px");
 			 divElement.html("<span class='text'>"+Msg.topocfg.dianbiaodeletetip+"</span>");
 		 }
 		 else{
 			 var nodedeviceid = lastData.getClient("deviceid");
			 var selectdeviceid = $("#selectedNode").val().split("@@")[0];
			 var strhtml = "";
			 divElement.css("margin-left","20px");
 			 divElement.css("margin-top","5px");
 			 var marchCount = 0;
 			 for(var i = 0;i < size ;i++){
 				 var nameOption  = dataOptions[i].name;                  //信号属性
 				 var colNameOption = dataOptions[i].colName;
 				 var idOption = dataOptions[i].id;
 				 var unitOption = dataOptions[i].metroUnit;
 				 var typeOption = dataOptions[i].dataTypeId;
 				 var marchflag = false;
 				 
 				 if(nodetypeid == 6){
 					if(/^PV[1-6]输入电流$/.test(nameOption)){            //2*3     匹配上
 						 marchCount++;
 	 					 if(arrsignals && (nodedeviceid == selectdeviceid)){
 	 			    		for(var k = 0; k < arrsignals.length ; k++){
 	 			    			if((idOption == arrsignals[k]) ){
 	 			    				strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"' checked  />"+nameOption+"</label>";
 	 			 					strhtml = strhtml + "<br/>";
 	 			 					marchflag = true;
 	 			 					break;
 	 			    			}
 	 			    		}
 	 			    		if(!marchflag){
 	 			    			strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"'  />"+nameOption+"</label>";
 	 			 				 strhtml = strhtml + "<br/>";
 	 			    		}
 	 			    	 }
 	 					 else{
 	 						  strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"'  checked/>"+nameOption+"</label>";
 			 				  strhtml = strhtml + "<br/>";
 	 					 }
 	 				 }
 				 }
 				 if(nodetypeid == 8){
 					if(/^PV[1-4]输入电流$/.test(nameOption)){  //2*2  匹配上
 						marchCount++;
 	 					if(arrsignals && (nodedeviceid == selectdeviceid)){
 	 			    		for(var k = 0; k < arrsignals.length ; k++){
 	 			    			if(idOption == arrsignals[k]){
 	 			    				strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"' checked  />"+nameOption+"</label>";
 	 			 					strhtml = strhtml + "<br/>";
 	 			 					marchflag = true;
 	 			 					break;
 	 			    			}
 	 			    		}
 	 			    		if(!marchflag){
 	 			    			strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"'  />"+nameOption+"</label>";
 	 			 				strhtml = strhtml + "<br/>";
 	 			    		}
 	 			    	 }
 	 					 else{
 	 						  strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"'  checked/>"+nameOption+"</label>";
 			 				  strhtml = strhtml + "<br/>";
 	 					 }
 					 }
 				 }
 				if(nodetypeid == 67){
 					if(/^PV[1-8]输入电流$/.test(nameOption)){  //2*4  匹配上
 						marchCount++;
 	 					if(arrsignals && (nodedeviceid == selectdeviceid)){
 	 			    		for(var k = 0; k < arrsignals.length ; k++){
 	 			    			if(idOption == arrsignals[k]){
 	 			    				strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"' checked  />"+nameOption+"</label>";
 	 			 					strhtml = strhtml + "<br/>";
 	 			 					marchflag = true;
 	 			 					break;
 	 			    			}
 	 			    		}
 	 			    		if(!marchflag){
 	 			    			strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"'  />"+nameOption+"</label>";
 	 			 				strhtml = strhtml + "<br/>";
 	 			    		}
 	 			    	 }
 	 					 else{
 	 						  strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' name='"+name+"'  checked/>"+nameOption+"</label>";
 			 				  strhtml = strhtml + "<br/>";
 	 					 }
 					 }
 				 }
 			 }
 			 if((nodetypeid == 6 && marchCount != 6) || (nodetypeid == 8 && marchCount != 4) || (nodetypeid == 67 && marchCount != 8)){        //没有正确匹配上
 	 			 for(var j = 0;j < size ;j++){
 	 				 var nameOption1  = dataOptions[j].name;                  //信号属性
 	 				 var colNameOption1 = dataOptions[j].colName;
 	 				 var idOption1 = dataOptions[j].id;
 	 				 var unitOption1 = dataOptions[j].metroUnit;
 	 				 var typeOption1 = dataOptions[j].dataTypeId;
 	 				 var marchflag1 = false;
 	 				 
 	 				 if(nodetypeid == 6){
 	 					if(!(/^PV[1-6]输入电流$/.test(nameOption1))){            //2*3     匹配上
 	 	 					 if(arrsignals && (nodedeviceid == selectdeviceid)){
 	 	 			    		for(var k = 0; k < arrsignals.length ; k++){
 	 	 			    			if((idOption1 == arrsignals[k]) ){
 	 	 			    				strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"' checked  />"+nameOption1+"</label>";
 	 	 			 					strhtml = strhtml + "<br/>";
 	 	 			 					marchflag1 = true;
 	 	 			 					break;
 	 	 			    			}
 	 	 			    		}
 	 	 			    		if(!marchflag1){
 	 	 			    			strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"'  />"+nameOption1+"</label>";
 	 	 			 				 strhtml = strhtml + "<br/>";
 	 	 			    		}
 	 	 			    	 }
 	 	 					 else{
 	 	 						  strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"'  />"+nameOption1+"</label>";
 	 			 				  strhtml = strhtml + "<br/>";
 	 	 					 }
 	 	 				 }
 	 				 }
 	 				 if(nodetypeid == 8){
 	 					if(!(/^PV[1-4]输入电流$/.test(nameOption1))){  //2*2  匹配上
 	 	 					if(arrsignals && (nodedeviceid == selectdeviceid)){
 	 	 			    		for(var k = 0; k < arrsignals.length ; k++){
 	 	 			    			if(idOption == arrsignals[k]){
 	 	 			    				strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"' checked  />"+nameOption1+"</label>";
 	 	 			 					strhtml = strhtml + "<br/>";
 	 	 			 					marchflag1 = true;
 	 	 			 					break;
 	 	 			    			}
 	 	 			    		}
 	 	 			    		if(!marchflag1){
 	 	 			    			strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"'  />"+nameOption1+"</label>";
 	 	 			 				strhtml = strhtml + "<br/>";
 	 	 			    		}
 	 	 			    	 }
 	 	 					 else{
 	 	 						  strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"'  />"+nameOption1+"</label>";
 	 			 				  strhtml = strhtml + "<br/>";
 	 	 					 }
 	 					 }
 	 				 }
 	 				if(nodetypeid == 67){
 	 					if(!(/^PV[1-8]输入电流$/.test(nameOption1))){  //2*2  匹配上
 	 	 					if(arrsignals && (nodedeviceid == selectdeviceid)){
 	 	 			    		for(var k = 0; k < arrsignals.length ; k++){
 	 	 			    			if(idOption == arrsignals[k]){
 	 	 			    				strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"' checked  />"+nameOption1+"</label>";
 	 	 			 					strhtml = strhtml + "<br/>";
 	 	 			 					marchflag1 = true;
 	 	 			 					break;
 	 	 			    			}
 	 	 			    		}
 	 	 			    		if(!marchflag1){
 	 	 			    			strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"'  />"+nameOption1+"</label>";
 	 	 			 				strhtml = strhtml + "<br/>";
 	 	 			    		}
 	 	 			    	 }
 	 	 					 else{
 	 	 						  strhtml = strhtml + "<label ><input type='checkbox'  value='"+idOption1+"@@"+nameOption1+"@@"+colNameOption1+"@@"+unitOption1+"@@"+typeOption1+"' name='"+name+"'  />"+nameOption1+"</label>";
 	 			 				  strhtml = strhtml + "<br/>";
 	 	 					 }
 	 					 }
 	 				 }
 	 			 }
 			 }
 			divElement.html(strhtml);
 		 }	
   },
   
   
   /**
	 * 增加可用网元信号信息<input type="radio">
	 * */
   appendRadioToDiv:function(dataOptions,divElement,lastData,sigflag,devorver){
   	     divElement.html("");
		 var size = dataOptions.length;
		 var nodedeviceid = lastData.getClient("deviceid");
		 var selectdeviceid = $("#selectedNode").val().split("@@")[0];
		 var modelVersionID = $("#selectedNode").val().split("@@")[2];                 //版本ID
		 var strhtml = "";
		 
		 if(size == 0){
 			 divElement.css("margin-left","70px");
 			 divElement.css("margin-top","120px");
 			 divElement.html("<span class='text'>"+Msg.topocfg.dianbiaodeletetip+"</span>");
	 	 }
		 else{
			 divElement.css("margin-left","20px");
 			 divElement.css("margin-top","5px");
			 for(var i = 0;i < size ;i++){
				 var nameOption  = dataOptions[i].name;
				 var colNameOption = dataOptions[i].colName;
				 var idOption = dataOptions[i].id;
				 var unitOption = dataOptions[i].metroUnit;
				 var typeOption = dataOptions[i].dataTypeId;
				 var modelVersionIdOption = dataOptions[i].modelVersionId
				 var signaltempid = "";
				 if(sigflag == "0"){
					 signaltempid = lastData.getClient("signalid");
				 }
				 else if(sigflag == "1"){
					 signaltempid = lastData.getClient("yksignalid"); 
				 }
				 else if(sigflag == "2"){
					 signaltempid = lastData.getClient("ykkqsignalid"); 
				 }
				 else{
					 signaltempid = lastData.getClient("ykgbsignalid"); 
				 }
				 if(devorver){                    //版本
					 if((idOption == signaltempid) && (modelVersionID == modelVersionIdOption)){
						 strhtml = strhtml + "<label ><input type='radio' name='devsignal' value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' checked />"+colNameOption+"</label>";
						 strhtml = strhtml + "<br/>";
					 }
					 else{
						 strhtml = strhtml + "<label ><input type='radio' name='devsignal' value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' />"+colNameOption+"</label>";
						 strhtml = strhtml + "<br/>";
					 }
				 }
				 else{                           //设备
					 if((idOption == signaltempid) && (nodedeviceid == selectdeviceid)){
						 strhtml = strhtml + "<label ><input type='radio' name='devsignal' value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' checked />"+colNameOption+"</label>";
						 strhtml = strhtml + "<br/>";
					 }
					 else{
						 strhtml = strhtml + "<label ><input type='radio' name='devsignal' value='"+idOption+"@@"+nameOption+"@@"+colNameOption+"@@"+unitOption+"@@"+typeOption+"' />"+colNameOption+"</label>";
						 strhtml = strhtml + "<br/>";
					 }
				}
			 }
			 divElement.html(strhtml);
		 }
  },

    sunDevOrBindSignal:function(bindInfo,selectedNode,flag,nodeInfo,box,curConfSchemaObj) {
        if (flag == "1") {
        	var deviceidtemp = selectedNode.getClient("deviceid");
        	var nodetypeid = selectedNode.getClient("nodetypeid");
        	bindInfo.name = encodeURIComponent(bindInfo.name);
        	bindInfo.businessCode = encodeURIComponent(bindInfo.businessCode);
            $.omcAjax("/cm/dev/add", bindInfo, function (data) {    //阳光化，绑定设备
                if (data.success == false) {
                	if(!deviceidtemp){
                		/*$("#alertdlg").dialog({height:180});*/
                		topo.Util.failTip(data,Msg.topocfg.adddevfail);  	                   //新增失败
                	}
                	else{
                		/*$("#alertdlg").dialog({height:180});*/
                		topo.Util.failTip(data,Msg.topocfg.updatedevinfofail);  	           //更新设备信息失败
                	}
                    return false;
                }
                var devid;
                bindInfo.name = decodeURIComponent(bindInfo.name);
                bindInfo.businessCode = decodeURIComponent(bindInfo.businessCode);
                if (data.success == true ) {
                    if (data.data ) {
                        var datasun = data.data;
                        devid = datasun.bindObjectId;                      //绑定设备，阳光化    ,保存拓扑
                    }
                    var setting = new twaver.SerializationSettings();
                    topo.Util.setClientPropertyType(setting);
                    var xmlSerializer = new twaver.XmlSerializer(box, setting);
                    nodeInfo.selfNode.setName(bindInfo.name);
                    nodeInfo.selfNode.setClient("bussinessCode", bindInfo.businessCode);     //信息保存在拓扑图元上
                    
                    if(nodetypeid == 15){           //箱变
                    	 nodeInfo.selfNode.setClient("highvswitch", bindInfo.highVSwitch);
                    	 nodeInfo.selfNode.setClient("lowvcircuitbreaker1", bindInfo.lowVCircuitBreaker1);
                    	 nodeInfo.selfNode.setClient("lowvcircuitbreaker2", bindInfo.lowVCircuitBreaker2);
                    }
                    /*else{
                    	 nodeInfo.selfNode.setClient("ESN", bindInfo.ESN);
                    }*/
                    nodeInfo.selfNode.setClient("ESN", bindInfo.ESN);
                    if (data.data) {
                        nodeInfo.selfNode.setClient("deviceid", devid);
                    }
                    nodeInfo.selfNode.setClient("devicename", bindInfo.businessCode);
                    nodeInfo.selfNode.setClient("name", bindInfo.name);
                    nodeInfo.selfNode.setClient("ip", bindInfo.ip);
                    nodeInfo.selfNode.setClient("modelVersionID", bindInfo.modelVersionID);
                    nodeInfo.selfNode.setClient("modelVersionName", bindInfo.modelVersionName);
                    nodeInfo.selfNode.setClient("secondaddress", bindInfo.protocolAddress);
                    nodeInfo.selfNode.setClient("kksCode", bindInfo.kksCode);
                    nodeInfo.selfNode.setClient("parentdevName", bindInfo.parentDevName);
                    nodeInfo.selfNode.setClient("devicePort", bindInfo.devicePort);

                    if(bindInfo.parentDevID){
	       	    		 var idFinder = new twaver.QuickFinder(box,"deviceid","client",function(e){
	       	    		 },function(e){
	       	    			if(e instanceof topo.JZNiBianQi){
	       	    				var deviceid = e.getClient("deviceid");
	       	    				return (deviceid == bindInfo.parentDevID);
	       	    			}else{
	       	    				return false;
	       	    			}
	       	    		 });
	       				 var devhostnode = idFinder.find(bindInfo.parentDevId).get(0); 
	       				 if(devhostnode && (devhostnode instanceof topo.JZNiBianQi) && (nodeInfo.selfNode instanceof topo.ZLHuiLiuXiang )){
	       					 nodeInfo.selfNode.setHost(devhostnode);
	       				 }
       	    	    }else{
	       				 if(nodeInfo.selfNode instanceof topo.ZLHuiLiuXiang ){
	       					 nodeInfo.selfNode.setHost(undefined);
	       				 }
       	    	    }
                    
                    var ConfSchemaInfo = {};
                    ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                    ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                    ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                    ConfSchemaInfo.id = curConfSchemaObj.id;
                    $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
                        if (data.success == false) {
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                            $("#alertmsg").html(Msg.topocfg.updatetopofail);                             //更新拓扑失败
                            $("#alertdlg").dialog("open");
                            return false;
                        }
                        else {
                        	 $( "#dlgChoDev" ).dialog("close");
                        	 curConfSchemaObj.schemaData = xmlSerializer.serialize();
                        	 curConfSchemaObj.timeStamp = data.data.timeStamp;
                        	 /*$("#alertdlg").dialog({height:180});*/
                        	 $("#alertmsg").html("");
                        	 $("#alertmsg").html(Msg.topocfg.savesuccess);                            //保存成功
                             $("#alertdlg").dialog("open");
                        }
                    });
                }
            },false);
        }
        else if (flag == 2) {
            $.omcAjax("/cm/SchemaNodeBind/save", bindInfo, function (data) {
                if (data.success == false) {
                	/*$("#alertdlg").dialog({height:180});*/
                	$("#alertmsg").html("");
                    $("#alertmsg").html(data.data.message);
                    $("#alertdlg").dialog("open");
                    return false;
                }
                if (data.success == true) {
                    var data = data.data;
                    var devID = data.bindObjectId;
                    var setting = new twaver.SerializationSettings();
                    topo.Util.setClientPropertyType(setting);
                    var xmlSerializer = new twaver.XmlSerializer(box, setting);
                    var xmlStr = xmlSerializer.serialize();
                    var ConfSchemaInfo = {};
                    ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                    ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                    ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                    ConfSchemaInfo.id = curConfSchemaObj.id;
                    box.add(nodeInfo.selfnode);                                                                    //增加信号节点到box里面
                    $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {                       //保存拓扑图ID
                        if (data.success == false) {
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                            $("#alertmsg").html(Msg.topocfg.updatetopofail);                                       //更新拓扑失败
                            $("#alertdlg").dialog("open");
                            return false;
                        }
                        else {
                        	$( "#dlgChoDev" ).dialog("close");
                        	curConfSchemaObj.schemaData = xmlSerializer.serialize(); 
                        	curConfSchemaObj.timeStamp = data.data.timeStamp;
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                        	$("#alertmsg").html(Msg.topocfg.savesuccess);                                          //保存成功
                            $("#alertdlg").dialog("open");
                        }
                    });
                }
            })
        }
        else if (flag == 3){
            $.omcAjax("/cm/SchemaNodeBind/save?capacity="+$("#inputDevCapacity").val(), bindInfo, function (data) {
                if (data.success == false) {
                	/*$("#alertdlg").dialog({height:180});*/
                	topo.Util.failTip(data,Msg.topocfg.bindsignalfail);  	                   //绑定信号失败
                    return false;
                }
                if (data.success == true) {
                    var data = data.data;
                    var devID = data.bindObjectId;
                    var schemaBindInfoID = data.id;                                            //绑定关系
                    var setting = new twaver.SerializationSettings();
                    topo.Util.setClientPropertyType(setting);
                    var xmlSerializer = new twaver.XmlSerializer(box, setting);
                    if ((nodeInfo.selfnode.getClient("nodetypeid") != 6) && (nodeInfo.selfnode.getClient("nodetypeid") != 8)
                    		&& (nodeInfo.selfnode.getClient("nodetypeid") != 46) && (nodeInfo.selfnode.getClient("nodetypeid") != 67)) {   //非组串图元关联设备信号
                    	//2015.04.29
                    	if(nodeInfo.selfnode.getClient("nodetypeid") == 7){
                    		/*var newnode = topo.Util.instanceObjByName(nodeInfo.selfnode);
                			box.remove(nodeInfo.selfnode);
                			nodeInfo.selfnode = newnode;
                			box.add(newnode);*/
                    		//2015.09.22
                    		topo.Util.clearNodeClient(nodeInfo.selfnode);
                    	}
                    	
                    	var nodetypeidtemp = nodeInfo.selfnode.getClient("nodetypeid");
                    	if((nodetypeidtemp != 9) && (nodetypeidtemp != 27) && (nodetypeidtemp != 40) && (nodetypeidtemp != 31)  
                    	   && (nodetypeidtemp != 31) && (nodetypeidtemp != 64)&& (nodetypeidtemp != 65) && (nodetypeidtemp != 68) ){                          //逆变器开关，断路器是不让信号名称显示出来
                    		 nodeInfo.selfnode.setName(nodeInfo.signalcolname);
                    	}
                        nodeInfo.selfnode.setClient("signalcolname", nodeInfo.signalcolname);
                        nodeInfo.selfnode.setClient("signalid", nodeInfo.signalid);                                                //关联设备信号ID
                        nodeInfo.selfnode.setClient("signalname", nodeInfo.signalcolname);                                         //关联设备信号名称
                        nodeInfo.selfnode.setClient("signalunit", nodeInfo.signalunit);
                        nodeInfo.selfnode.setClient("signaltype", nodeInfo.signaltype);
                        nodeInfo.selfnode.setClient("schemaBindInfoID", schemaBindInfoID);
                        if(nodeInfo.hostnode.deviceid){                                                                            //针对从设备表里面取设备的情况
                        	 nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.deviceid);
                        	 nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.devverid);
                        	 nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.devorvername);                             //设备名称
                        }
                        else{
                        	 nodeInfo.selfnode.setClient("hostnodename", nodeInfo.hostnode.getName());
                             nodeInfo.selfnode.setClient("hostnodeid", nodeInfo.hostnode.getId());
                             nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.getClient("deviceid"));                         //关联设备ID
                             var selectvalue  = $("#selectedNode").val();
                             var arrselectvalue = selectvalue.split("@@");
						     var deviceid = arrselectvalue[0];
                             if(deviceid == "undefined"){                                                                                           //为空说明是关联版本
                            	 nodeInfo.selfnode.setClient("modelVersionName",$("#selectedNode").find("option:selected").text());
                             }
                             else{
                            	 if(!(nodeInfo.selfnode instanceof topo.circleChart)){
                            		 nodeInfo.selfnode.setHost(nodeInfo.hostnode); 
                            	 }
                             }
                             nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.getClient("bussinessCode"));                  //关联设备名称
                             nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.getClient("modelVersionID"));             //关联版本ID
                             //nodeInfo.selfnode.setHost(nodeInfo.hostnode);
                        }
                        nodeInfo.selfnode.setClient("schemaBindInfoID", schemaBindInfoID);
                        var ConfSchemaInfo = {};
                        ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                        ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                        ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                        ConfSchemaInfo.id = curConfSchemaObj.id;
                        $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {       //保存拓扑图ID
                            if (data.success == false) {
                            	/*$("#alertdlg").dialog({height:180});*/
                            	$("#alertmsg").html("");
                                $("#alertmsg").html(Msg.topocfg.updatetopofail);                                   //更新拓扑失败
                                $("#alertdlg").dialog("open");
                                return false;
                            }
                            else {
                            	$( "#dlgChoAssNode" ).dialog("close");
                            	curConfSchemaObj.schemaData = xmlSerializer.serialize();
                            	curConfSchemaObj.timeStamp = data.data.timeStamp;
                            	/*$("#alertdlg").dialog({height:180});*/
                            	$("#alertmsg").html("");
                            	$("#alertmsg").html(Msg.topocfg.savesuccess);                                      //保存成功
                                $("#alertdlg").dialog("open");
                            }
                        });
                    }
                    if((nodeInfo.selfnode.getClient("nodetypeid") == 6) || (nodeInfo.selfnode.getClient("nodetypeid") == 8) ||
                    		nodeInfo.selfnode.getClient("nodetypeid") == 46 || nodeInfo.selfnode.getClient("nodetypeid") == 67){
						nodeInfo.selfnode.setClient("signalcolname", nodeInfo.signalcolname);
                        nodeInfo.selfnode.setClient("signalid", nodeInfo.signalid);                                                //关联设备信号ID
                        nodeInfo.selfnode.setClient("signalname", nodeInfo.signalname);                                            //关联设备信号名称
                        nodeInfo.selfnode.setClient("signalunit", nodeInfo.signalunit);
                        nodeInfo.selfnode.setClient("signaltype", nodeInfo.signaltype);
                        nodeInfo.selfnode.setClient("hostnodename", nodeInfo.hostnode.getName());
                        nodeInfo.selfnode.setClient("hostnodeid", nodeInfo.hostnode.getId());
                        nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.getClient("deviceid"));                         //关联设备ID
                        nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.getClient("bussinessCode"));                  //关联设备名称
                        nodeInfo.selfnode.setClient("capacity",$("#inputDevCapacity").val()); 
                        
                        var schemaBindInfoIDTemp = nodeInfo.selfnode.getClient("schemaBindInfoID");
                        if((schemaBindInfoIDTemp == null) || (schemaBindInfoIDTemp == undefined) ||(schemaBindInfoIDTemp == "")){
                        	schemaBindInfoIDTemp = schemaBindInfoID;
                        }
                        else{
                        	schemaBindInfoIDTemp = schemaBindInfoIDTemp + "," + schemaBindInfoID;
                        }
                        nodeInfo.selfnode.setClient("schemaBindInfoID", schemaBindInfoIDTemp);
                        nodeInfo.selfnode.setHost(nodeInfo.hostnode);
                        
                        var ConfSchemaInfo = {};
                        ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                        ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                        ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                        ConfSchemaInfo.id = curConfSchemaObj.id;
                        
                        $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {       //保存拓扑图ID
                            if (data.success == false) {
                            	/*$("#alertdlg").dialog({height:180});*/
                            	$("#alertmsg").html("");
                                $("#alertmsg").html(Msg.topocfg.updatetopofail);                       //更新拓扑失败
                                $("#alertdlg").dialog("open");
                                return false;
                            }
                            else {
                            	$( "#dlgChoAssNode" ).dialog("close");
                            	curConfSchemaObj.schemaData = xmlSerializer.serialize();
                            	curConfSchemaObj.timeStamp = data.data.timeStamp;
                            	/*$("#alertdlg").dialog({height:180});*/
                            	$("#alertmsg").html("");
                            	$("#alertmsg").html(Msg.topocfg.savesuccess);                          //保存成功
                                $("#alertdlg").dialog("open");
                            }
                        },false);
					}
                }
            },false)
        }
        else if(flag == 4){                                                                                         //遥控信号
        	$.omcAjax("/cm/SchemaNodeBind/save", bindInfo, function (data) {
                if (data.success == false) {
                	/*$("#alertdlg").dialog({height:180});*/
                	topo.Util.failTip(data,Msg.topocfg.bindsignalfail);  	                   //绑定信号失败
                    return false;
                }
                if (data.success == true) {
                    var data = data.data;
                    var devID = data.bindObjectId;
                    var schemaBindInfoID = data.id;  
                    var setting = new twaver.SerializationSettings();
                    topo.Util.setClientPropertyType(setting);
                    var xmlSerializer = new twaver.XmlSerializer(box, setting);
                    var nodetypeidtemp = nodeInfo.selfnode.getClient("nodetypeid");
                	if((nodetypeidtemp != 9) && (nodetypeidtemp != 27) && (nodetypeidtemp != 40) && (nodetypeidtemp != 31)
                		&& (nodetypeidtemp != 64)&& (nodetypeidtemp != 65) && (nodetypeidtemp != 66) ){    //逆变器开关，断路器是不让信号名称显示出来
                		 nodeInfo.selfnode.setName(nodeInfo.signalname);
                	}
                    nodeInfo.selfnode.setClient("yksignalcolname", nodeInfo.signalcolname);
                    nodeInfo.selfnode.setClient("yksignalid", nodeInfo.signalid);                                                //关联设备信号ID
                    nodeInfo.selfnode.setClient("yksignalname", nodeInfo.signalname);                                            //关联设备信号名称
                    nodeInfo.selfnode.setClient("yksignalunit", nodeInfo.signalunit);
                    nodeInfo.selfnode.setClient("yksignaltype", nodeInfo.signaltype);
                    if(nodeInfo.hostnode.deviceid){                                                                            //针对从设备表里面取设备的情况
	                   	 nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.deviceid);
	                   	 nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.devverid);
	                   	 nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.devorvername);                             //设备名称
                    }
                    else{
                   	    nodeInfo.selfnode.setClient("hostnodename", nodeInfo.hostnode.getName());
                        nodeInfo.selfnode.setClient("hostnodeid", nodeInfo.hostnode.getId());
                        nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.getClient("deviceid"));                         //关联设备ID
                        var selectvalue  = $("#selectedNode").val();
                        var arrselectvalue = selectvalue.split("@@");
					    var deviceid = arrselectvalue[0];
                        if(deviceid == "undefined"){                                                                              //为空说明是关联版本
                       	    nodeInfo.selfnode.setClient("modelVersionName",$("#selectedNode").find("option:selected").text());
                        } 
                        else{
                       	    nodeInfo.selfnode.setHost(nodeInfo.hostnode);                                                        //2015.01.26
                        }
                        nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.getClient("bussinessCode"));                  //关联设备名称
                        nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.getClient("modelVersionID"));             //关联版本ID
                        //nodeInfo.selfnode.setHost(nodeInfo.hostnode);
                   }
                    nodeInfo.selfnode.setClient("ykschemaBindInfoID", schemaBindInfoID);
                    var ConfSchemaInfo = {};
                    ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                    ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                    ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                    ConfSchemaInfo.id = curConfSchemaObj.id;
                    $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {       //保存拓扑图ID
                        if (data.success == false) {
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                            $("#alertmsg").html(Msg.topocfg.updatetopofail);                       //更新拓扑失败
                            $("#alertdlg").dialog("open");
                            return false;
                        }
                        else {
                        	$( "#dlgChoAssNode" ).dialog("close");
                        	curConfSchemaObj.schemaData = xmlSerializer.serialize();
                        	curConfSchemaObj.timeStamp = data.data.timeStamp;
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                        	$("#alertmsg").html(Msg.topocfg.savesuccess);                       //保存成功
                            $("#alertdlg").dialog("open");
                        }
                    });
                }
            })
        }
        else if(flag == 5){                                                                                         //逆变器开关开启
        	$.omcAjax("/cm/SchemaNodeBind/save", bindInfo, function (data) {
                if (data.success == false) {
                	/*$("#alertdlg").dialog({height:180});*/
                	topo.Util.failTip(data,Msg.topocfg.bindsignalfail);  	                   //绑定信号失败
                    return false;
                }
                if (data.success == true) {
                    var data = data.data;
                    var devID = data.bindObjectId;
                    var schemaBindInfoID = data.id;  
                    var setting = new twaver.SerializationSettings();
                    topo.Util.setClientPropertyType(setting);
                    var xmlSerializer = new twaver.XmlSerializer(box, setting);
                    var nodetypeidtemp = nodeInfo.selfnode.getClient("nodetypeid");
                	if((nodetypeidtemp != 9) && (nodetypeidtemp != 27) && (nodetypeidtemp != 40)&& (nodetypeidtemp != 31)
                	  && (nodetypeidtemp != 64)&& (nodetypeidtemp != 65)){       //逆变器开关，断路器是不让信号名称显示出来
                		 nodeInfo.selfnode.setName(nodeInfo.signalname);
                	}
                    nodeInfo.selfnode.setClient("ykkqsignalcolname", nodeInfo.signalcolname);
                    nodeInfo.selfnode.setClient("ykkqsignalid", nodeInfo.signalid);                                                //关联设备信号ID
                    nodeInfo.selfnode.setClient("ykkqsignalname", nodeInfo.signalcolname);                                            //关联设备信号名称
                    nodeInfo.selfnode.setClient("ykkqsignalunit", nodeInfo.signalunit);
                    nodeInfo.selfnode.setClient("ykkqsignaltype", nodeInfo.signaltype);
                    if(nodeInfo.hostnode.deviceid){                                                                            //针对从设备表里面取设备的情况
	                   	 nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.deviceid);
	                   	 nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.devverid);
	                   	 nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.devorvername);                             //设备名称
                    }
                    else{
                   	    nodeInfo.selfnode.setClient("hostnodename", nodeInfo.hostnode.getName());
                        nodeInfo.selfnode.setClient("hostnodeid", nodeInfo.hostnode.getId());
                        nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.getClient("deviceid"));                         //关联设备ID
                        var selectvalue  = $("#selectedNode").val();
                        var arrselectvalue = selectvalue.split("@@");
					    var deviceid = arrselectvalue[0];
                        if(deviceid == "undefined"){                                                                                           //为空说明是关联版本
                       	 	nodeInfo.selfnode.setClient("modelVersionName",$("#selectedNode").find("option:selected").text());
                        }
                        else{
                        	nodeInfo.selfnode.setHost(nodeInfo.hostnode);                                                        //2015.01.26
                        }
                        nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.getClient("bussinessCode"));                  //关联设备名称
                        nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.getClient("modelVersionID"));             //关联版本ID
                        //nodeInfo.selfnode.setHost(nodeInfo.hostnode);
                    }
                    nodeInfo.selfnode.setClient("ykkqschemaBindInfoID", schemaBindInfoID);
                    var ConfSchemaInfo = {};
                    ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                    ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                    ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                    ConfSchemaInfo.id = curConfSchemaObj.id;
                    $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {       //保存拓扑图ID
                        if (data.success == false) {
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                            $("#alertmsg").html(Msg.topocfg.updatetopofail);                       //更新拓扑失败
                            $("#alertdlg").dialog("open");
                            return false;
                        }
                        else {
                        	$( "#dlgChoAssNode" ).dialog("close");
                        	curConfSchemaObj.schemaData = xmlSerializer.serialize();
                        	curConfSchemaObj.timeStamp = data.data.timeStamp;
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                        	$("#alertmsg").html(Msg.topocfg.savesuccess);                        //保存成功
                            $("#alertdlg").dialog("open");
                        }
                    });
                }
            })
        }
        else {                                                                                         //逆变器开关关闭
        	$.omcAjax("/cm/SchemaNodeBind/save", bindInfo, function (data) {
                if (data.success == false) {
                	/*$("#alertdlg").dialog({height:180});*/
                	topo.Util.failTip(data,Msg.topocfg.bindsignalfail);  	                   //绑定信号失败
                    return false;
                }
                if (data.success == true) {
                    var data = data.data;
                    var devID = data.bindObjectId;
                    var schemaBindInfoID = data.id;  
                    var setting = new twaver.SerializationSettings();
                    topo.Util.setClientPropertyType(setting);
                    var xmlSerializer = new twaver.XmlSerializer(box, setting);
                    var nodetypeidtemp = nodeInfo.selfnode.getClient("nodetypeid");
                	if((nodetypeidtemp != 9) && (nodetypeidtemp != 27) && (nodetypeidtemp != 40)&& (nodetypeidtemp != 31)
                		&& (nodetypeidtemp != 64)&& (nodetypeidtemp != 65)){       //逆变器开关，断路器是不让信号名称显示出来
                		 nodeInfo.selfnode.setName(nodeInfo.signalname);
                	}
                    nodeInfo.selfnode.setClient("ykgbsignalcolname", nodeInfo.signalcolname);
                    nodeInfo.selfnode.setClient("ykgbsignalid", nodeInfo.signalid);                                                //关联设备信号ID
                    nodeInfo.selfnode.setClient("ykgbsignalname", nodeInfo.signalcolname);                                            //关联设备信号名称
                    nodeInfo.selfnode.setClient("ykgbsignalunit", nodeInfo.signalunit);
                    nodeInfo.selfnode.setClient("ykgbsignaltype", nodeInfo.signaltype);
                    if(nodeInfo.hostnode.deviceid){                                                                            //针对从设备表里面取设备的情况
                      	 nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.deviceid);
                      	 nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.devverid);
                      	 nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.devorvername);                             //设备名称
                    }
                    else{
                      	   nodeInfo.selfnode.setClient("hostnodename", nodeInfo.hostnode.getName());
                           nodeInfo.selfnode.setClient("hostnodeid", nodeInfo.hostnode.getId());
                           nodeInfo.selfnode.setClient("deviceid",nodeInfo.hostnode.getClient("deviceid"));                         //关联设备ID
                           var selectvalue  = $("#selectedNode").val();
                           var arrselectvalue = selectvalue.split("@@");
   					       var deviceid = arrselectvalue[0];
                           if(deviceid == "undefined"){                                                                                           //为空说明是关联版本
                        	   nodeInfo.selfnode.setClient("modelVersionName",$("#selectedNode").find("option:selected").text());
                           }
                           else{
                        	   nodeInfo.selfnode.setHost(nodeInfo.hostnode);                                                        //2015.01.26
                           }
                           nodeInfo.selfnode.setClient("devicename",nodeInfo.hostnode.getClient("bussinessCode"));                  //关联设备名称
                           nodeInfo.selfnode.setClient("modelVersionID",nodeInfo.hostnode.getClient("modelVersionID"));             //关联版本ID
                           //nodeInfo.selfnode.setHost(nodeInfo.hostnode);
                    }
                    nodeInfo.selfnode.setClient("ykgbschemaBindInfoID", schemaBindInfoID);
                    var ConfSchemaInfo = {};
                    ConfSchemaInfo.schemaData = xmlSerializer.serialize();
                    ConfSchemaInfo.busiObjectId = curConfSchemaObj.busiObjectId;
                    ConfSchemaInfo.schemeTypeId = curConfSchemaObj.schemeTypeId;
                    ConfSchemaInfo.id = curConfSchemaObj.id;
                    
                    $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {       //保存拓扑图ID
                        if (data.success == false) {
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                            $("#alertmsg").html(Msg.topocfg.updatetopofail);                       //更新拓扑失败
                            $("#alertdlg").dialog("open");
                            return false;
                        }
                        else {
                        	$( "#dlgChoAssNode" ).dialog("close");
                        	curConfSchemaObj.schemaData = xmlSerializer.serialize();
                        	curConfSchemaObj.timeStamp = data.data.timeStamp;
                        	/*$("#alertdlg").dialog({height:180});*/
                        	$("#alertmsg").html("");
                        	$("#alertmsg").html(Msg.topocfg.savesuccess);                          //保存成功
                            $("#alertdlg").dialog("open");
                        }
                    });
                }
            })
        }
    }
}


/**
 *重构节点标签
 */

function CommonHtmlToPoLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(CommonHtmlToPoLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
       /* var font = this.getFont('label.font');*/
    	//var font = "14px '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
    	var fontsize = this.getElement().getClient("labelfontsize")
    	var font = fontsize + "px" + " '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif"
    	var color = this.getStyle('label.color');
        var text = this.getLabel();
        if(text.indexOf("<br>") > -1){
	        var textarr = text.split("<br>")
	        var texthtml = "";
	        for(var i = 0;i < textarr.length;i++){
	        	texthtml =texthtml+"<div>"+textarr[i]+"</div>";
	        }
	        this._contentDiv.innerHTML = texthtml;
        }
        else{
        	this._contentDiv.innerHTML = text;
        }

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        twaver.Util.setCSSStyle(this._contentDiv, "text-align", "center");
       /* console.info(this._contentDiv);*/
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        //twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});


function CommonHtmlLabelNodeUI(network, element) {
	CommonHtmlLabelNodeUI.superClass.constructor.call(this, network, element);
}

twaver.Util.ext(CommonHtmlLabelNodeUI, twaver.network.NodeUI, {
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new CommonHtmlToPoLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
});

/**
 * 逆变器类
 */
topo.NiBianQi = function (id) {               
	topo.NiBianQi.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.xoffset', -70);
	this.setImage("nibianqizcr");
};
twaver.Util.ext('topo.NiBianQi', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 通用节点
 */
topo.TongYong = function (id) {               
	topo.TongYong.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("tongyong");
};
twaver.Util.ext('topo.TongYong', twaver.Node,{
   
});


/**
 * 逆变器类3D
 */
topo.NiBianQi3D = function (id) {               
	topo.NiBianQi3D.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setStyle('label.yoffset', 2);
	this.setImage("nibianqi3d");
	this.setName(Msg.topocfg.nibianqi);
};
twaver.Util.ext('topo.NiBianQi3D', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 集中式逆变器
 */
topo.JZNiBianQi = function (id) {               
	topo.JZNiBianQi.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.xoffset', -70);
	this.setImage("jzNBQ-right");
};
twaver.Util.ext('topo.JZNiBianQi', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 集中式逆变器类3D
 */
topo.JZNiBianQi3D = function (id) {               
	topo.JZNiBianQi3D.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setStyle('label.yoffset', 2);
	this.setImage("jzNBQ3D");
	this.setName(Msg.topocfg.jizhongnibianqi);
};
twaver.Util.ext('topo.JZNiBianQi3D', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 集中式箱变3D
 */
topo.JZXiangBian3D = function (id) {               
	topo.JZXiangBian3D.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setStyle('label.yoffset', 2);
	this.setImage("xiangbian3D");
	this.setName(Msg.topocfg.jizhongxb3d);
};
twaver.Util.ext('topo.JZXiangBian3D', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 直流汇流箱类
 */
topo.ZLHuiLiuXiang = function (id) {               
	topo.ZLHuiLiuXiang.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.xoffset', -70);
	this.setImage("zlHLXr");
};
twaver.Util.ext('topo.ZLHuiLiuXiang', twaver.Follower,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 直流汇流箱类3D
 */
topo.ZLHuiLiuXiang3D = function (id) {               
	topo.ZLHuiLiuXiang3D.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setStyle('label.yoffset', 2);
	this.setImage("3d-zlHLXr");
	this.setName(Msg.topocfg.zhiliuhuiliuxiang);
};
twaver.Util.ext('topo.ZLHuiLiuXiang3D', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 组串支架类
 */
topo.Shelf23 = function (id) {                                
	    topo.Shelf23.superClass.constructor.call(this, id);
	    this.setImage('zuchuan23r');
	    this.setStyle('grid.row.count', 2);
	    this.setStyle('grid.column.count', 3);
	    this.setStyle('label.color', "#ffffff");
		this.setStyle('label.position', "bottom.bottom");
		this.setStyle('label.font', Msg.topocfg.font12);
		this.setWidth(114);
	    this.setHeight(30);
};
twaver.Util.ext('topo.Shelf23', twaver.Grid,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 组串支架类
 */
topo.Shelf22 = function (id) {                                
	    topo.Shelf22.superClass.constructor.call(this, id);
	    this.setImage("zuchuan22r");
	    this.setStyle('grid.row.count', 2);
	    this.setStyle('grid.column.count', 2);
	    this.setStyle('label.color', "#ffffff");
		this.setStyle('label.position', "bottom.bottom");
		this.setStyle('label.font', Msg.topocfg.font12);
		this.setWidth(76);
	    this.setHeight(30);
};
twaver.Util.ext('topo.Shelf22', twaver.Grid,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 组串支架类
 */
topo.Shelf24 = function (id) {                                
	    topo.Shelf24.superClass.constructor.call(this, id);
	    this.setImage("zuchuan24r");
	    this.setStyle('grid.row.count', 2);
	    this.setStyle('grid.column.count', 4);
	    this.setStyle('label.color', "#ffffff");
		this.setStyle('label.position', "bottom.bottom");
		this.setStyle('label.font', Msg.topocfg.font12);
		this.setWidth(152);
	    this.setHeight(30);
};
twaver.Util.ext('topo.Shelf24', twaver.Grid,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/** 集中式组串 */
topo.JZZuChuan = function(id){
	 topo.JZZuChuan.superClass.constructor.call(this, id);
	    //this.setImage("jzZuChuan");
	    this.setStyle('grid.row.count', 2);
	    this.setStyle('grid.column.count', 8);
//	    this.setStyle('grid.fill.color',"#0000ff");
	    this.setStyle('label.color', "#ffffff");
		this.setStyle('label.position', "bottom.bottom");
		this.setStyle('label.font', Msg.topocfg.font12);
		this.setWidth(38*8);
	    this.setHeight(15*2);
	    /*
	    for(var i=0;i<8;i++){
	    	for(var j=0;j<2;j++){
	    		var cell=new twaver.Grid();
	    		cell.setImage("zuchuanlan");
	    		cell.setStyle("follower.row.index",j);
	    		cell.setStyle("follower.column.index",i);
	    		cell.setStyle('label.color', "#ffffff");
	    		cell.setStyle('label.position', "bottom.bottom");
	    		cell.setStyle('label.font', Msg.topocfg.font12);
	    		cell.setHost(this);
	    		this.addChild(cell);
	    	}
	    }*/
};
twaver.Util.ext('topo.JZZuChuan', twaver.Grid,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
	
});

/**
 * 组串3D类
 */
topo.ZuChuan3D = function (id) {                                
	    topo.ZuChuan3D.superClass.constructor.call(this, id);
	    this.setImage("zuchuan3dr");
	    this.setName(Msg.topocfg.guangfubanzu);
	    this.setStyle('label.color', "#ffffff");
		this.setStyle('label.position', "bottom.bottom");
		this.setStyle('label.font', Msg.topocfg.font14);
};
twaver.Util.ext('topo.ZuChuan3D', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 表格类
 */
topo.Table = function (id) {                                
	    topo.Table.superClass.constructor.call(this, id);
	    this.setStyle('label.color', "#ffffff");
		this.setStyle('label.position', "bottom.bottom");
	    this.setStyle('grid.row.count', 10);
	    this.setStyle('grid.column.count', 2);
	    this.setStyle('grid.fill', false);
	    this.setStyle('grid.border', 1);
	    this.setStyle('grid.deep', 1);
		this.setStyle('grid.padding', 1);
	    this.setStyle('label.font', Msg.topocfg.font12);
	    this.setWidth(400);
	    this.setHeight(360);
};
twaver.Util.ext('topo.Table', twaver.Grid,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 总线（母线）类
 */
topo.BusNode = function (id) {                            
	topo.TextNode.superClass.constructor.call(this, id);
	this.setSize(500,8);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#ffff00");
    this.setStyle('label.font', Msg.topocfg.font12);
};

twaver.Util.ext('topo.BusNode', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 横线
 */
topo.HengXian = function (id) {                            
	topo.HengXian.superClass.constructor.call(this, id);
	this.setSize(40,1);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#ffcc00");
    this.setStyle('label.color', '#FFFFFF');
    this.setStyle('label.position','top.top');
    this.setStyle('label.font', Msg.topocfg.font12);
};

twaver.Util.ext('topo.HengXian', twaver.Grid,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 竖线
 */
topo.ShuXian = function (id) {                            
	topo.ShuXian.superClass.constructor.call(this, id);
	this.setSize(1,40);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#ffcc00");
    this.setStyle('label.color', '#FFFFFF');
    this.setStyle('label.position','right.right');
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.ShuXian', twaver.Grid,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 数据类
 */
topo.Text = function (id) {
	demo.Text.superClass.constructor.call(this, id);
   /* this.setStyle('body.type', 'none');*/
    this.setStyle('label.color', '#ffffff');
    this.setStyle('label.position','center');
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font12);
    /*this.setWidth(0);
    this.setHeight(0);*/
    this.setImage("toumingpic");
    this.setName('Text');
};
twaver.Util.ext('topo.Text', twaver.Follower,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 子阵
 */
topo.ZiZhen = function (id) {
    topo.ZiZhen.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("zizhenr");
};
twaver.Util.ext('topo.ZiZhen', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 子阵小机
 */
topo.ZiZhenXJ = function (id) {
    topo.ZiZhen.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("zizhenxjr");
};
twaver.Util.ext('topo.ZiZhenXJ', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 三相
 */
topo.SanXiang = function (id) {
    topo.SanXiang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	//this.setImage("sanxiangr");
	this.setImage("xbsjzt1");
};
twaver.Util.ext('topo.SanXiang', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 两相 ，两脚
 */
topo.LiangXiangLJ = function (id) {
    topo.LiangXiangLJ.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	//this.setImage("liangxiangljr");
	this.setImage("xbljzt2");
};
twaver.Util.ext('topo.LiangXiangLJ', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 两相 ，三脚
 */
topo.LiangXiangSJ = function (id) {
    topo.LiangXiangSJ.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	//this.setImage("liangxiangsjr");
	this.setImage("xbljzt1");
};
twaver.Util.ext('topo.LiangXiangSJ', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 断路器
 */
topo.DuanLuQi = function (id) {
    topo.DuanLuQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("duanluqir");
};
twaver.Util.ext('topo.DuanLuQi', twaver.Follower,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 断路器（主接线）
 */
topo.DuanLuQiZJX = function (id) {
    topo.DuanLuQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("duanluqizjxr");
};
twaver.Util.ext('topo.DuanLuQiZJX', twaver.Follower,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 隔离刀闸
 */
topo.GeLiDaoZha = function (id) {
    topo.GeLiDaoZha.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("GLDZ-HE");
};
twaver.Util.ext('topo.GeLiDaoZha', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 光字牌
 */

function HtmlGuangZiPaiLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlGuangZiPaiLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
    	//var font = "30px arial, tahoma, helvetica, sans-serif";
    	//alert(this.getElement().getClient("nodetypeid"))
    	//var fontsize = this.getElement().getClient("labelfontsize")
    	//var font = fontsize + "px" + " '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
    	//var font = "16px '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
    	var color = this.getStyle('label.color');
        var text = this.getLabel();
        this._contentDiv.innerHTML = text;

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        twaver.Util.setCSSStyle(this._contentDiv, "text-align", "center");
       /* console.info(this._contentDiv);*/
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        //twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});


function HtmlGuangZiPaiLabelNodeUI(network, element) {
    HtmlLabelNodeUI.superClass.constructor.call(this, network, element);
}

twaver.Util.ext(HtmlGuangZiPaiLabelNodeUI, twaver.network.NodeUI, {
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlGuangZiPaiLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
});


topo.GuangZiPai = function (id) {
    topo.GuangZiPai.superClass.constructor.call(this, id);
    this.setStyle('body.type', 'vector');
    this.setStyle('vector.shape', "rectangle");
    this.setStyle('vector.fill.color', "#00ff00");  
    this.setStyle('vector.outline.color', "#666666");
    this.setStyle('vector.outline.width', 2);
    this.setStyle('vector.padding', 2);
    this.setStyle('label.color', "#000000");
    this.setStyle('label.position', "center");
    this.setStyle('label.xoffset', 0);
    this.setStyle('label.yoffset', 0);
    this.setStyle('label.font', Msg.topocfg.font18);
    //this.setStyle('lable.font', "30px arial, tahoma, helvetica, sans-serif");
    this.setName(Msg.topocfg.guangzipai);
    this.setSize(200,40);
};
twaver.Util.ext('topo.GuangZiPai', twaver.Grid,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	        return HtmlGuangZiPaiLabelNodeUI;
	}*/
});


/**
 * 箱变
 */
topo.XiangBian = function (id) {
    topo.XiangBian.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("xiangbianr");
};
twaver.Util.ext('topo.XiangBian', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 数采
 */
topo.ShuJuCaiJiQi = function (id) {
    topo.ShuJuCaiJiQi.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("shujucaijiqir");
};
twaver.Util.ext('topo.ShuJuCaiJiQi', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 交流汇流箱
 */
topo.JLHuiLiuXiang = function (id) {
    topo.JLHuiLiuXiang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
    this.setImage("jiaoliuhuiliuxiangr");
};
twaver.Util.ext('topo.JLHuiLiuXiang', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 交流汇流箱3D
 */
topo.JLHuiLiuXiang3D = function (id) {
    topo.JLHuiLiuXiang3D.superClass.constructor.call(this, id);
    this.setImage("jiaoliuhuiliuxiang3dr");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setName(Msg.topocfg.huiliuxiang);
	
};
twaver.Util.ext('topo.JLHuiLiuXiang3D', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 环境监测仪
 */
topo.HuJingJianCeYi = function (id) {
    topo.HuJingJianCeYi.superClass.constructor.call(this, id);
    this.setImage("huanjingyir");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	
};
twaver.Util.ext('topo.HuJingJianCeYi', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 三相3D
 */
topo.SanXiang3D = function (id) {
	topo.SanXiang3D.superClass.constructor.call(this, id);
    //this.setImage("sanxiang3dr");
	this.setImage("xbsjft1");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setName(Msg.topocfg.xiangbian);
	
};
twaver.Util.ext('topo.SanXiang3D', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 两相3D  ，两脚
 */
topo.LiangXiang3DLJ = function (id) {
	topo.LiangXiang3DLJ.superClass.constructor.call(this, id);
    //this.setImage("liangxiang3dljr");
	this.setImage("xbljft2");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setName(Msg.topocfg.xiangbian);
	
};
twaver.Util.ext('topo.LiangXiang3DLJ', twaver.Node,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 两相3D  ，三脚
 */
topo.LiangXiang3DSJ = function (id) {
	topo.LiangXiang3DSJ.superClass.constructor.call(this, id);
    //this.setImage("liangxiang3dsjr");
	this.setImage("xbljft1");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setName(Msg.topocfg.xiangbian);
	
};
twaver.Util.ext('topo.LiangXiang3DSJ', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 断路器3D
 */
topo.DuanLuQi3D = function (id) {
    topo.DuanLuQi3D.superClass.constructor.call(this, id);
    this.setImage("duanluqi3dr");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	
};
twaver.Util.ext('topo.DuanLuQi3D', twaver.Follower,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 * 跳转按钮
 */

function HtmlToPoLabelAttachment(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlToPoLabelAttachment, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
    	//var font = "14px '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif";
    	var fontsize = this.getElement().getClient("labelfontsize")
    /*	var font = fontsize + "px" + " '微软雅黑', '宋体', arial, tahoma, helvetica, sans-serif"*/
    	var color = this.getStyle('label.color');
        var text = this.getLabel();
        if(text.indexOf("<br>") > -1){
	        var textarr = text.split("<br>")
	        var texthtml = "";
	        for(var i = 0;i < textarr.length;i++){
	        	texthtml =texthtml+"<div>"+textarr[i]+"</div>";
	        }
	        this._contentDiv.innerHTML = texthtml;
        }
        else{
        	this._contentDiv.innerHTML = text;
        }

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        twaver.Util.setCSSStyle(this._contentDiv, "text-align", "center");
       /* console.info(this._contentDiv);*/
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
        //twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});


function HtmlLabelNodeUI(network, element) {
    HtmlLabelNodeUI.superClass.constructor.call(this, network, element);
}

twaver.Util.ext(HtmlLabelNodeUI, twaver.network.NodeUI, {
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlToPoLabelAttachment(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
});


topo.SkipButton = function (id) {
	 topo.SkipButton.superClass.constructor.call(this, id);
	    this.setStyle('body.type', 'vector');
	    this.setStyle('vector.shape', "rectangle");
	    this.setStyle('vector.outline.color', "#3e3e3e");
	    this.setStyle('vector.outline.width',1);
	    this.setStyle('vector.fill.color', "#222222");
	    this.setStyle('label.color', "#FFFFFF");
	    this.setStyle('label.position', "center");
	    this.setStyle('label.xoffset', 0);
	    this.setStyle('label.yoffset', 0);
	    this.setStyle('label.font', Msg.topocfg.font14);
	    this.setName(Msg.topocfg.skipbutton);
	    this.setSize(120,40);
	
};
twaver.Util.ext('topo.SkipButton', twaver.Grid, {
    getElementUIClass: function () {
        return HtmlLabelNodeUI;
    },
    /*serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}*/
});
/**
 * 电站状态
 */
topo.StatusButton = function (id) {
	 topo.StatusButton.superClass.constructor.call(this, id);
	    this.setStyle('body.type', 'vector');
	    this.setStyle('vector.shape', "rectangle");
	    this.setStyle('vector.outline.color', "rgb(0, 184, 18)");
	    this.setStyle('vector.outline.width',2);
	    this.setStyle('vector.fill.color', "rgb(44, 44, 68)");
	    this.setStyle('label.color', "#FFFFFF");
	    this.setStyle('label.position', "center");
	    this.setStyle('label.xoffset', 0);
	    this.setStyle('label.yoffset', 0);
	    this.setStyle('label.font', Msg.topocfg.font14);
	 //   this.setName(Msg.topocfg.statusButton);
	    this.setSize(20,40);
	
};
twaver.Util.ext('topo.StatusButton', twaver.Grid, {
   getElementUIClass: function () {
       return HtmlLabelNodeUI;
   },
   /*serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}*/
});
/**
 * 索引节点
 */
topo.IndexNode = function (id) {
	topo.IndexNode.superClass.constructor.call(this, id);
    this.setImage("indexnode");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "center");
	this.setStyle('label.xoffset', 0);
	this.setStyle('label.yoffset', -40);
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setName(Msg.topocfg.indexnode);
	this.setSize(120,40);
	
};
twaver.Util.ext('topo.IndexNode', twaver.Grid, {
	getElementUIClass: function () {
		return HtmlLabelNodeUI;
	},
	/*serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}*/
});


function HtmlLabelAttachmentChart(elementUI, showInAttachmentDiv) {
    HtmlBasicAttachment.call(this, elementUI, showInAttachmentDiv);
    this.label = true;
}
twaver.Util.ext(HtmlLabelAttachmentChart, twaver.network.LabelAttachment, {
    updateMeasure: function () {
        var font = this.getFont('label.font');
        var text = this.getLabel();
        var color = this.getStyle('label.color');
        this._contentDiv.innerHTML = text;

        twaver.Util.setCSSStyle(this._contentDiv, "font", font);
        twaver.Util.setCSSStyle(this._contentDiv, "color", color);
        HtmlBasicAttachment.prototype.updateMeasure.call(this);
//        twaver.Util.removeCSSStyle(this._contentDiv, "font");
    },
    calculateMeasure: HtmlBasicAttachment.prototype.calculateMeasure
});


function chartNodeUI(network, element) {
    chartNodeUI.superClass.constructor.call(this, network, element);
}
twaver.Util.ext(chartNodeUI, twaver.network.NodeUI, {
    checkAttachments: function () {
        twaver.network.NodeUI.prototype.checkAttachments.call(this);
        this.checkComponentAttachment();
    },
    checkComponentAttachment: function () {
        if (!this._componentAttachment&&this._element.getStyle('component.content')) {
            this._componentAttachment = new HtmlComponentAttachment(this);
            this.addAttachment(this._componentAttachment);
        }
    },
    checkLabelAttachment: function () {
        var label = this._network.getLabel(this._element);
        if (label != null && label !== "") {
            if (!this._labelAttachment) {
                this._labelAttachment = new HtmlLabelAttachmentChart(this);
                this.addAttachment(this._labelAttachment);
            }
        } else {
            if (this._labelAttachment) {
                this.removeAttachment(this._labelAttachment);
                this._labelAttachment = null;
            }
        }
    },
    checkAlarmAttachment: function () {
        var label = this._network.getAlarmLabel(this._element);
        if (label != null && label !== "") {
            if (!this._alarmAttachment) {
                this._alarmAttachment = new HtmlAlarmAttachment(this, false);
                this.addAttachment(this._alarmAttachment);
            }
        } else {
            if (this._alarmAttachment) {
                this.removeAttachment(this._alarmAttachment);
                this._alarmAttachment = null;
            }
        }
    },
	 drawBody: function () {
    }
});
function chartNode(id) {
    chartNode.superClass.constructor.call(this, id);
	
}
twaver.Util.ext(chartNode, twaver.Node, {
    getElementUIClass: function () {
        return chartNodeUI;
    }
});

var dafatCharValue = ["00","","","","","","","","","","","","01","","","","","","","","","","","","02","","","","","","","","","","","","03","","","","","","","","","","","","04","","","","","","","","","","","","05","","","","","","","","","","","","06","","","","","","","","","","","","07","","","","","","","","","","","","08","","","","","","","","","","","","09","","","","","","","","","","","","10","","","","","","","","","","","","11","","","","","","","","","","","","12","","","","","","","","","","","","13","","","","","","","","","","","","14","","","","","","","","","","","","15","","","","","","","","","","","","16","","","","","","","","","","","","17","","","","","","","","","","","","18","","","","","","","","","","","","19","","","","","","","","","","","","20","","","","","","","","","","","","21","","","","","","","","","","","","22","","","","","","","","","","","","23","","","","","","","","","","",""];
var realCharValue = ["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:04","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:05","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","09:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:35","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00",  	"20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00",	"21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"];
/**
 * 注册实体 曲线图
 */
topo.circleChart = function (id) {
	topo.circleChart.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#FFFFFF");
    this.setStyle('component.fillcolor', 'transparent'); //设置背景色 
//	this.setStyle('component.fillcolor', '#071f30');
	this.setStyle('component.position', 'topright');  //设置位置
	this.setStyle('component.direction', 'aboveright');
	this.setStyle('label.font',Msg.topocfg.font14);
	this.setStyle('label.position','right.right');
    this.setStyle('component.pointer.length', 1);
    this.setStyle('component.pointer.width', 1);
    this.setStyle('label.yoffset', -8);
    this.setStyle('label.xoffset', 40);
	this.lineChart =  new twaver.charts.LineChart();
//	this.lineChart.setXAxisText("分钟"); //设置x轴名字
    this.lineChart.setXAxisTextColor("red");//设置x轴名字颜色
    this.lineChart.setYAxisTextColor('white');//设置Y轴名字颜色
	this.lineChart.setYScaleTextColor("#FFFFFF");//设置Y轴坐标上的颜色
    this.lineChart.setXScaleTextColor("#FFFFFF");//设置X轴坐标上的颜色
    this.lineChart.isInterruptable(false); //设置是否可截断 
	this.lineChart.setYScaleMinTextVisible(true);
    this.lineChart.setYScaleValueGap(2); //设置y轴间距
    this.lineChart.setLowerLimit(0); //设置y轴最小值
    this.lineChart.setUpperLimit(10); //设置y轴最大值
    this.lineChart.setFocusOnClick(false);
    this.lineChart.setMaxZoom(1);//设置最大放大倍数
	this.lineChart.setMinZoom(1);
    this.lineChart.setInterruptable(true);//设置不连续
    this.lineChart.setValueVisible(false);//线上是否显示值
	this.lineChart.setYScaleLineWidth(0);//设置y轴网格线宽度

	this.lineChart.setXScaleLineWidth(0);//设置x轴网格线宽度
 	this.setStyle('component.width', 500);
	this.setStyle('component.height', 300); 
	this.setStyle('circleChart.color', 'white'); 
	this.lineChart.getView().style.width = 500+"px";//这种曲线图宽度
    this.lineChart.getView().style.height = 300+"px";//这种曲线图高度

    this.lineChart.formatValueText = function (value) {
        return value+'';
    }
    this.lineChart.addToolTipInfo = function(x,y,w,h,value,data,index ){
    	if(value =='undefined' || !value){
    		value = "";
    	}
    	this._toolTipInfos && this._toolTipInfos.add({
              data: data,
              rect: {x: x, y: y, width: w, height: h},
              value: Msg.circleChart.chartTime+"："+realCharValue[index]+"<br/>"+Msg.circleChart.chartValue+"："+value,
              index: index
         })
    }
    
	var developedElement = new twaver.Element();
    developedElement.setName('circleChart');
    developedElement.setStyle('chart.color', 'white');//设置线条颜色
    developedElement.setStyle('chart.value.color', 'white');
    developedElement.setStyle('chart.marker.shape', 'circle');//设置描点形状
    developedElement.setStyle('chart.marker.size', 5);//设置点大小
    developedElement.setStyle('chart.marker.color', 'red');//设置点大小
    developedElement.setStyle('chart.values',[1,2,3,4,5,6,7,8,9,10,3,4]);//修改数据
    this.lineChart.getDataBox().add(developedElement);
	this.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
	this.setStyle('component.content', this.lineChart.getView());
	
};

twaver.Util.ext('topo.circleChart', twaver.Node, {
	getElementUIClass: function () {
		return chartNodeUI;
	},
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setStyleType("component.width","cdata");
		twaver.SerializationSettings.setStyleType("component.height","cdata");
		twaver.SerializationSettings.setStyleType("component.fillcolor","cdata");
		twaver.SerializationSettings.setStyleType("circleChart.color","cdata");
		twaver.Node.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "component.width", newInstance);
		this.serializePropertyXml(serializer, "component.height", newInstance);
		this.serializePropertyXml(serializer, "component.fillcolor", newInstance);
		this.serializePropertyXml(serializer, "circleChart.color", newInstance);
	}
});


/**
 * PT
 */
topo.PT = function (id) {
	topo.PT.superClass.constructor.call(this, id);
    this.setImage("ptr");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	
};
twaver.Util.ext('topo.PT', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});


/**
 *  图片
 */
topo.ImageNode = function (id) {
	topo.ImageNode.superClass.constructor.call(this, id);
    this.setImage("imagenoder");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.ImageNode', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 *  接地开关（左）
 */
topo.JieDiKaiGuanZuo = function (id) {
	topo.JieDiKaiGuanZuo.superClass.constructor.call(this, id);
    this.setImage("jiedikaiguanzuor");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.yoffset', -12);
	this.setHeight(48);
	this.setWidth(48);
};
twaver.Util.ext('topo.JieDiKaiGuanZuo', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});

/**
 *  接地开关（右）
 */
topo.JieDiKaiGuanYou = function (id) {
	topo.JieDiKaiGuanYou.superClass.constructor.call(this, id);
    this.setImage("jiedikaiguanyour");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.yoffset', -12);
};
twaver.Util.ext('topo.JieDiKaiGuanYou', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});


/**
 *  隔离刀闸（上）
 */
topo.GeLiDaoZhaShang = function (id) {
	topo.GeLiDaoZhaShang.superClass.constructor.call(this, id);
    this.setImage("gelidaozhashangr");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "left.left");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.xoffset', 12);
};
twaver.Util.ext('topo.GeLiDaoZhaShang', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});

/**
 *  隔离刀闸（下）
 */
topo.GeLiDaoZhaXia = function (id) {
	topo.GeLiDaoZhaXia.superClass.constructor.call(this, id);
    this.setImage("gelidaozhaxiar");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "left.left");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.xoffset', 12);
};
twaver.Util.ext('topo.GeLiDaoZhaXia', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});

/**
 *  地线
 */
topo.DiXianYou = function (id) {
	topo.DiXianYou.superClass.constructor.call(this, id);
    this.setImage("dixianyour");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setWidth(18);
	this.setHeight(48);
};
twaver.Util.ext('topo.DiXianYou', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});

/**
 *  地线
 */
topo.DiXianZuo = function (id) {
	topo.DiXianZuo.superClass.constructor.call(this, id);
    this.setImage("dixianzuor");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.DiXianZuo', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});


/**
 *  上箭头
 */
topo.ShangJianTou = function (id) {
	topo.ShangJianTou.superClass.constructor.call(this, id);
    this.setImage("shangjiantour");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setWidth(12);
	this.setHeight(49);
};
twaver.Util.ext('topo.ShangJianTou', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});

/**
 *  下箭头
 */
topo.XiaJianTou = function (id) {
	topo.XiaJianTou.superClass.constructor.call(this, id);
    this.setImage("xiajiantour");
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.XiaJianTou', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
	/*getElementUIClass: function () {
	    return CommonHtmlLabelNodeUI;
	}*/
});

/**
 *  连线
 */
topo.Link = function (id) {
	topo.Link.superClass.constructor.call(this, id);
	this.setStyle('link.corner', "none");
	this.setStyle('link.color', "#ffff00");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('link.width', 1);
};
twaver.Util.ext('topo.Link', twaver.Link,{
   /* getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 *  连线
 */
topo.ShapeLink = function (id,fromnode,tonode) {
	topo.ShapeLink.superClass.constructor.call(this, id,fromnode,tonode);
	this.setStyle('link.corner', "none");
	this.setStyle('link.color', "#ffff00");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('link.width', 1);
};
twaver.Util.ext('topo.Link', twaver.ShapeLink,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 * 功率调节
 */
topo.PowerRegulation = function (id) {
	topo.PowerRegulation.superClass.constructor.call(this, id);
	this.setImage("powerRegulation");
	 this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.PowerRegulation', twaver.Node,{
});

/**
 * PID
 */
topo.pidTopo = function (id) {
	topo.PowerRegulation.superClass.constructor.call(this, id);
	this.setImage("pidTopoImg");
	this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.pidTopo', twaver.Node,{
});

/**
 * PID3D
 */
topo.pidTopo3D = function (id) {
	topo.PowerRegulation.superClass.constructor.call(this, id);
	this.setImage("pidTopoImg3D");
	this.setStyle('label.color', "#ffffff");
    this.setStyle('label.position', "bottom.bottom");
    this.setStyle('label.font', Msg.topocfg.font12);
    this.setName(Msg.topocfg.pidTopo);
    this.setSize(128,128);
};
twaver.Util.ext('topo.pidTopo3D', twaver.Node,{
});

/**
 *  箱变电表
 */
topo.DianBiao = function (id) {
	 topo.DianBiao.superClass.constructor.call(this, id);
	 this.setImage("dianbiaor");
	 this.setStyle('label.color', "#ffffff");
     this.setStyle('label.position', "bottom.bottom");
     this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.DianBiao', twaver.Node,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});
/**
 *  关口电表
 */
topo.gkDianBiao = function (id) {
	topo.gkDianBiao.superClass.constructor.call(this, id);
	this.setImage("gk_dianbiaor");
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.gkDianBiao', twaver.Node,{
	/*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});
/**
 *  汇集站线路电表
 */
topo.hjzDianBiao = function (id) {
	topo.hjzDianBiao.superClass.constructor.call(this, id);
	this.setImage("hjz_dianbiaor");
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.hjzDianBiao', twaver.Node,{
	/*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});
/**
 *  厂用电生产区电表
 */
topo.cydFactoryDianBiao = function (id) {
	topo.cydFactoryDianBiao.superClass.constructor.call(this, id);
	this.setImage("cyd_factorydianbiaor");
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.cydFactoryDianBiao', twaver.Node,{
	/*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 *  厂用电非生产区电表
 */
topo.cydFactoryNonDianBiao = function (id) {
	topo.cydFactoryNonDianBiao.superClass.constructor.call(this, id);
	this.setImage("cyd_factorynondianbiaor");
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
};
twaver.Util.ext('topo.cydFactoryNonDianBiao', twaver.Node,{
	/*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 *  逆变器开关
 */
topo.NiBianQiKaiGuan = function (id) {
	 topo.NiBianQiKaiGuan.superClass.constructor.call(this, id);
	 this.setImage("nibianqikaiguanr");
	 this.setStyle('label.color', "#ffffff");
     this.setStyle('label.position', "bottom.bottom");
     this.setStyle('label.font', Msg.topocfg.font14);
};
twaver.Util.ext('topo.NiBianQiKaiGuan', twaver.Follower,{
    /*getElementUIClass: function () {
        return CommonHtmlLabelNodeUI;
    }*/
});

/**
 *  不规则图形
 */
topo.ShapeNode = function (id) {
	 topo.ShapeNode.superClass.constructor.call(this, id);
	 /*this.setStyle('label.color', "#ffffff");
     this.setStyle('label.position', "bottom.bottom");
     this.setStyle('label.font', Msg.topocfg.font14);*/
	 
	 this.setStyle('vector.outline.width', 2);
	 this.setStyle('vector.fill', true);
     this.setStyle('vector.fill.color', "#efa110");
     this.setStyle('vector.outline.color', "#FFFFFF");
 	 this.setStyle('label.font', Msg.topocfg.font12);
     this.setStyle('whole.alpha', 0.8);
};
twaver.Util.ext('topo.ShapeNode', twaver.ShapeNode,{
	
});


topo.XBLJZT1 = function (id) {
    topo.XBLJZT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbljzt1");
};
twaver.Util.ext('topo.XBLJZT1', twaver.Node,{
	
});

topo.XBLJFT1 = function (id) {
    topo.XBLJFT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbljft1");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT1', twaver.Node,{
	
});
topo.XBLJZT2 = function (id) {
    topo.XBLJZT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbljzt2");
};
twaver.Util.ext('topo.XBLJZT2', twaver.Node,{
	
});

topo.XBLJFT2 = function (id) {
    topo.XBLJFT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbljft2");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT2', twaver.Node,{
	
});

topo.XBLJZT3 = function (id) {
    topo.XBLJZT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbljzt3");
};
twaver.Util.ext('topo.XBLJZT3', twaver.Node,{
	
});

topo.XBLJFT3 = function (id) {
    topo.XBLJFT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbljft3");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT3', twaver.Node,{
	
});


topo.XBLJZT4 = function (id) {
    topo.XBLJZT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbljzt4");
};
twaver.Util.ext('topo.XBLJZT4', twaver.Node,{
	
});

topo.XBLJFT4 = function (id) {
    topo.XBLJFT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbljft4");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBLJFT4', twaver.Node,{
	
});

topo.XBSJZT1 = function (id) {
    topo.XBSJZT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbsjzt1");
};
twaver.Util.ext('topo.XBSJZT1', twaver.Node,{
	
});

topo.XBSJFT1 = function (id) {
    topo.XBSJFT1.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbsjft1");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT1', twaver.Node,{
	
});



topo.XBSJZT2 = function (id) {
    topo.XBSJZT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbsjzt2");
};
twaver.Util.ext('topo.XBSJZT2', twaver.Node,{
	
});

topo.XBSJFT2 = function (id) {
    topo.XBSJFT2.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbsjft2");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT2', twaver.Node,{
	
});

topo.XBSJZT3 = function (id) {
    topo.XBSJZT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbsjzt3");
};
twaver.Util.ext('topo.XBSJZT3', twaver.Node,{
	
});

topo.XBSJFT3 = function (id) {
    topo.XBSJFT3.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbsjft3");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT3', twaver.Node,{
	
});


topo.XBSJZT4 = function (id) {
    topo.XBSJZT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbsjzt4");
};
twaver.Util.ext('topo.XBSJZT4', twaver.Node,{
	
});

topo.XBSJFT4 = function (id) {
    topo.XBSJFT4.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbsjft4");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT4', twaver.Node,{
	
});


topo.XBSJZT5 = function (id) {
    topo.XBSJZT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("xbsjzt5");
};
twaver.Util.ext('topo.XBSJZT5', twaver.Node,{
	
});

topo.XBSJFT5 = function (id) {
    topo.XBSJFT5.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font14);
	this.setImage("xbsjft5");
	this.setName(Msg.topocfg.xiangbian);
};
twaver.Util.ext('topo.XBSJFT5', twaver.Node,{
	
});


/**
 * 通关机
 */
topo.TGJ = function (id) {               
	topo.TGJ.superClass.constructor.call(this, id);
	this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "bottom.bottom");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setStyle('label.xoffset', -70);
	this.setImage("tgjd");
};
twaver.Util.ext('topo.TGJ', twaver.Node,{
	
});

/**
 * 避雷针
 */
topo.BiLeiZhen = function (id) {
    topo.BiLeiZhen.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("bileizhenr");
	this.setWidth(11);
	this.setHeight(30);
};
twaver.Util.ext('topo.BiLeiZhen', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});

/**
 * 带电装置
 */
topo.DaiDianZZ = function (id) {
    topo.DaiDianZZ.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("daidianzzr");
	this.setHeight(20);
	this.setWidth(20);
};
twaver.Util.ext('topo.DaiDianZZ', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});


/**
 * 电容
 */
topo.DianRong = function (id) {
    topo.DianRong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("dianrongr");
	this.setWidth(30);
	this.setHeight(21);
};
twaver.Util.ext('topo.DianRong', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});


/**
 * 电抗
 */
topo.DianKang = function (id) {
    topo.DianKang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("diankangr");
	this.setWidth(16);
	this.setHeight(30);
};
twaver.Util.ext('topo.DianKang', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});

/**
 * 分裂电抗
 */
topo.FLDianKang = function (id) {
    topo.FLDianKang.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setImage("fldiankangr");
	this.setWidth(22);
	this.setHeight(30);
};
twaver.Util.ext('topo.FLDianKang', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});

/**
 * 电感
 */
topo.DianGan = function (id) {
    topo.DianGan.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setWidth(31);
	this.setHeight(11);
	this.setImage("dianganr");
};
twaver.Util.ext('topo.DianGan', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});

/**
 * 手车
 */
topo.ShouChe = function (id) {
    topo.ShouChe.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setWidth(23);
	this.setHeight(106);
	this.setImage("shoucher");
};
twaver.Util.ext('topo.ShouChe', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});

/**
 * 远控/就地
 */
topo.YuanKong = function (id) {
    topo.YuanKong.superClass.constructor.call(this, id);
    this.setStyle('label.color', "#ffffff");
	this.setStyle('label.position', "right.right");
	this.setStyle('label.font', Msg.topocfg.font12);
	this.setHeight(32);
	this.setWidth(32);
	this.setImage("yuankongr");
};
twaver.Util.ext('topo.YuanKong', twaver.Follower,{
	serializeXml:function(serializer, newInstance){
		twaver.SerializationSettings.setPropertyType("angle","number");
		twaver.Follower.prototype.serializeXml.call(this,serializer, newInstance);
		this.serializePropertyXml(serializer, "angle", newInstance);
	}
});

/**
 * 属性表单
 */
topo.PropertySheet = function(dataBox) {
	topo.PropertySheet.superClass.constructor.call(this, dataBox);
	this.setBorderColor("none");
	this.setRowHeight(35);
	this.setSelectColor("none"); 
	this.setCategorizable(false);
	this._view.style.minWidth = '400px';
};

twaver.Util.ext('topo.PropertySheet', twaver.controls.PropertySheet,{
	adjustWidth:function(){
		twaver.controls.PropertySheet.prototype.adjustWidth.call(this);
		//this._view.style.overflowX = "auto";
	},
	onCategoryRendered:function (div, categoryName){
		div.style.backgroundColor = "none";    //232323
		div.style.color = "#c0c0c0";
		div.style.fontSize = "14px";
		div.style.fontFamily = Msg.topocfg.fontclass;
		div.style.border = "none";
		
	},
	
	updateCurrentRowIndex :function(newIndex){
		var self = this;
		twaver.controls.PropertySheet.prototype.updateCurrentRowIndex.apply(this,arguments);
		var params = this._rowList.get(newIndex);
		var pro = null;
		if(params){
			pro = params.property;
		}
		if(this._currentEditor){
			this._currentEditor.style.background = "#001f41";
			this._currentEditor.style.padding = "1px 1px 1px 1px";
			this._currentEditor.style.color = "#c0c0c0";
			this._currentEditor.style.fontSize = "14px";
			this._currentEditor.style.fontFamily = Msg.topocfg.fontclass;
			if(pro){
				if(pro._propertyName == "label.color" || pro._propertyName == "link.color" 
					|| pro._propertyName == "vector.outline.color" ||pro._propertyName == "vector.fill.color" 
					||pro._propertyName == "component.fillcolor" ||pro._propertyName == "grid.fill.color"
						||pro._propertyName == "circleChart.color"){
					var $v = $(this._currentEditor);
					$v.attr("readonly",true);
					$v.colpick({
					    colorScheme: 'dark',
					    onSubmit: function (hsb, hex, rgb, el) {
		                     var strcol = "#" + hex;
		                     if(pro._propertyName == "circleChart.color"){
		                    	 self._currentData.setStyle(pro._propertyName,strcol);
		                    	 self._currentData.lineChart.getDataBox()._dataList.forEach(function(datas) {
		                    		 datas.setStyle('chart.color',strcol);
		                    	 });
		                    	 self._currentData.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
		                    	 self._currentData.setStyle('component.content', self._currentData.lineChart.getView());
		                     }else{
		                    	 self._currentData.setStyle(pro._propertyName,strcol);
		                     }
		                     $v.colpickHide();
					    }
					});
				}
				if(pro._propertyName == "name"){   
					if(self._currentData instanceof topo.SkipButton || self._currentData instanceof topo.IndexNode || self._currentData instanceof topo.StatusButton){
						var $ve = $(this._currentEditor);
						$ve.attr("title",Msg.topocfg.skiptip);
					}
					else if(self._currentData instanceof topo.Text){
						var $ve = $(this._currentEditor);
						$ve.attr("title",Msg.topocfg.oneormorechar);
					}
					else{
						var $ve = $(this._currentEditor);
						$ve.attr("title",Msg.topocfg.nomorechar);
					}
				}
				if((pro._propertyName == "grid.column.count")){         //表格 1-50       
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.tablecheck);
				}
				if((pro._propertyName == "grid.row.count")){            //表格   1-50 
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.tablecheck);
				}
				if((pro._propertyName == "label.xoffset")){            //标签 x   -100 - 100  
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.nodeprocheck);
				}
				if((pro._propertyName == "label.yoffset")){            //标签 y    -100 - 100  
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.nodeprocheck);
				}
				if((pro._propertyName == "link.width")){               // 连线宽度 0 - 100  
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.linkprocheck);   
				}
				if((pro._propertyName == "link.from.xoffset")){        //连线起点x   -100 - 100  
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.nodeprocheck);
				}
				if((pro._propertyName == "link.from.yoffset")){        //连线起点y   -100 - 100  
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.nodeprocheck);   
				}
				if((pro._propertyName == "link.to.xoffset")){          //连线终点 x   -100 - 100  
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.nodeprocheck);
				}
				if((pro._propertyName == "link.to.yoffset")){          //连线终点y   -100 - 100
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.nodeprocheck);   
				}
				if((pro._propertyName == "link.extend")){             
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.linkprocheck);
				}
				if( ((pro._propertyName == "width")) && ((self._currentData instanceof topo.HengXian) 
						|| (self._currentData instanceof topo.ShuXian))){             
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.xianwidthcheck);
				}
				if( ((pro._propertyName == "height")) && ((self._currentData instanceof topo.HengXian) 
						|| (self._currentData instanceof topo.ShuXian)) ){             
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.xianheightcheck);
				}
				if(pro._propertyName == "component.height"){          //曲线高度
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.circlenodeHeightprocheck);   
				}
				if( pro._propertyName == "component.width"){          //曲线宽度
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.circlenodeWidthprocheck);   
				}
				if( pro._propertyName == "grid.border" || pro._propertyName == "grid.deep" || pro._propertyName == "grid.padding"
				   || pro._propertyName == "grid.cell.deep"){          //表格属性
					var $ve = $(this._currentEditor);
					$ve.attr("title",Msg.topocfg.tableprocheck);   
				}
			}
		}
	},
	
	
	onNameRendered : function (params){
		params.rowDiv.style.border = "none";
		params.rowDiv.style.color = "#c0c0c0";
		params.rowDiv.style.backgroundColor = "none";   //#051733
		params.rowDiv.style.fontSize = "14px";
		params.rowDiv.style.fontFamily = Msg.topocfg.fontclass;
		params.nameRender.style.border = "none";
		params.nameRender.style.textAlign = "right";
		params.nameRender.style.margin="0px 0px 0px -5px"
		params.nameRender.style.height = "28px";
	},
	
	onValueRendered:function(params){
		var pro = params.property;
		if(pro.isEditable()){
			params.valueRender.style.backgroundColor = "none";
		}
		else{
			params.valueRender.style.backgroundColor = "#001f41";
		}
		params.valueRender.style.border = "1px solid #247ed3";
		params.valueRender.style.height = "28px";
		params.valueRender.style.width = "150px";
	},
	
	handlePropertyChange:function(e){  
		var valflag = true;
		if(e.property == "name"){
			var newvalue = e.newValue;
			if((newvalue != null) &&(newvalue != undefined)){
				 newvalue = newvalue.replace(/(^\s*)|(\s*$)/g,"");
	        }
			if(((newvalue == "") || ((newvalue != "") && (newvalue.length > 32)))&& (e.source instanceof topo.Text)){
				 var valuetemp = e.oldValue ? e.oldValue:"Text";
				 this._currentData.setName(valuetemp);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else if((newvalue != "") && (newvalue.length > 32)){
				 var valuetemp = e.newValue.substr(0,32);
				 this._currentData.setName(valuetemp);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:label.xoffset"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < -100)){
				 this._currentData.setStyle("label.xoffset",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:label.yoffset"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < -100)){
				 this._currentData.setStyle("label.yoffset",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:link.width"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue <= 0)){
				 this._currentData.setStyle("link.width",e.oldValue ? e.oldValue:1);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:link.from.xoffset"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < -100)){
				 this._currentData.setStyle("link.from.xoffset",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:link.from.yoffset"){
			var newvalue = e.newValue;
			var oldValue = e.oldValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < -100)){
				 this._currentData.setStyle("link.from.yoffset",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:link.to.xoffset"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < -100)){
				 this._currentData.setStyle("link.to.xoffset",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:link.to.yoffset"){ 
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < -100)){
				 this._currentData.setStyle("link.to.yoffset",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:grid.border" || e.property == "S:grid.deep" || e.property == "S:grid.padding"
				   || e.property == "S:grid.cell.deep"){ 
			var property = e.property;
			var property= property.substr(2,property.length);
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 10) || (newvalue < -10)){
				 this._currentData.setStyle(property,e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}		
		else if(e.property == "S:link.extend"){ 
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 100) || (newvalue < 1)){
				 this._currentData.setStyle("link.extend",e.oldValue ? e.oldValue:0);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 valflag = true;
			}
		}
		else if(e.property == "S:component.height"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 800) || (newvalue < 100)){
				 this._currentData.setStyle("component.height",e.oldValue ? e.oldValue:500);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				 this._currentData.lineChart.getView().style.height = newvalue+'px';
				 this._currentData.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
				 this._currentData.setStyle('component.content', this._currentData.lineChart.getView());
				 valflag = true;
			}
		}else if(e.property == "S:component.width"){
			var newvalue = e.newValue;
			if((isNaN(newvalue)) ||(newvalue > 1200) || (newvalue < 100)){
				 this._currentData.setStyle("component.width",e.oldValue ? e.oldValue:500);
                 this._box.getSelectionModel().appendSelection(this._currentData);
				 valflag = false;
			}
			else{
				this._currentData.lineChart.getView().style.width = newvalue+'px';
				this._currentData.lineChart.setXScaleTexts(new twaver.List(dafatCharValue));//x轴
				this._currentData.setStyle('component.content', this._currentData.lineChart.getView());
				valflag = true;
			}
		}
		else{
			 valflag = true;
		}
		if((this._currentData === e.source)&& valflag){ 
			 this.invalidate();
		}
	}
});


