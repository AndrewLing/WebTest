topoComon = {
		associateTopoOkFun:function(selectednode,selectvalue){
			if(selectednode.getClient("nodetypeid") == 4 || selectednode.getClient("nodetypeid") == 51 
			  || selectednode.getClient("nodetypeid") == 28  || selectednode.getClient("nodetypeid") == 55){
			  //|| selectednode.getClient("nodetypeid") == 68  屏蔽电站状态关联的名字显示
				selectednode.setName($("#selectedTopoGraph").find("option:selected").text());
			}
			if(selectednode.getClient("nodetypeid") == 51){
				selectednode.setStyle('label.position', "center");
			}
			selectednode.setClient("topographid",selectvalue); 
			selectednode.setClient("topographname",$("#selectedTopoGraph").find("option:selected").text()); 
		},
		
		associateDevVerOKFun:function(selectednode,devverid){
			selectednode.setClient("modelVersionID", devverid);
			selectednode.setClient("modelVersionName", $("#selectedDevVer").find("option:selected").text());
		},
		
		assDevProOKFun:function(selectednode,devInfoRadioValArr,self){
			topo.Util.clearNodeClient(selectednode);
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
		},
		
		associateDevSignalOKFun:function(selectednode,self){
			if((selectednode.getClient("nodetypeid") != 6)&&(selectednode.getClient("nodetypeid") != 8)&&(selectednode.getClient("nodetypeid") != 46) &&(selectednode.getClient("nodetypeid") != 67)){   //非组�?动态数�?
				 var selectvalue  = $("#selectedNode").val();
				 if(!selectvalue){
					 $("#alertmsg").html("");
	                 $("#alertmsg").html(Msg.topocfg.pleasechosedev);                          //没有选择信号
	                 $("#alertdlg").dialog("open");
	                 return false;
				 }
				 var selectname = $("#selectedNode").find("option:selected").text();                          //设备名字或者版本名�?
				 var arrselectvalue = selectvalue.split("@@");
		    	 var deviceid = arrselectvalue[0];
		    	 var hostnodeid = arrselectvalue[1];
		    	 var devverid = arrselectvalue[2];
				 var idFinder = new twaver.QuickFinder(self.box,"id");
				 var hostnode = idFinder.find(hostnodeid).get(0);                   //寻找关联图元NODE
				 var signalinfo = $("input[type='radio'][name='devsignal']:checked");                //单�?
				 var strtemp = signalinfo.val();
				 if(!strtemp){
					 $("#alertmsg").html("");
	                 $("#alertmsg").html(Msg.topocfg.nochosesignal);                          //没有选择信号
	                 $("#alertdlg").dialog("open");
	                 return false;
				 }
				 var arrsignalinfo = strtemp.split("@@");
				 var signalid = arrsignalinfo[0];                                  //信号ID
				 var signalname = arrsignalinfo[1];                                //信号name
				 var signalcolname = arrsignalinfo[2];                             //信号colName
				 var signalunit = arrsignalinfo[3];                                //信号unit
				 var signaltype = arrsignalinfo[4];                                //信号类型
				 
				 var schemaNodeBindInfo = {}
			     schemaNodeBindInfo.bindType = 2;
			     schemaNodeBindInfo.parentNodeGuid = hostnodeid;
				 schemaNodeBindInfo.pelNodeGuid = selectednode.getId();
				 schemaNodeBindInfo.bindObjectId = signalid;
				 schemaNodeBindInfo.schemaID = self.curConfSchemaObj.id;
				 if((hostnode == undefined) || (hostnode == null)){                                                    //从设备表取，不是从当前拓扑取（几种开关要从设备表里面去设备）
						hostnode = {"deviceid":deviceid,"modelVersionID":devverid,"devorvername":selectname};
			     }
				 var nodeInfo = {};
		    	 nodeInfo.hostnode = hostnode;
		    	 nodeInfo.selfnode = selectednode;
		    	 nodeInfo.signalid = signalid;
		    	 nodeInfo.signalname = signalname;
		    	 nodeInfo.signalcolname = signalcolname;
		    	 nodeInfo.signalunit = signalunit;
		    	 nodeInfo.signaltype = signaltype;
		    	 if(self.signalflag == 0){                                                                                           //一般关联信�?
		    		 var schemaBindInfoIDTemp = selectednode.getClient("schemaBindInfoID");                                          //没有绑定信号
					 if((schemaBindInfoIDTemp == null) || (schemaBindInfoIDTemp == undefined) ||(schemaBindInfoIDTemp == "")){
						 topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"3",nodeInfo,self.box,self.curConfSchemaObj); 
					 }
					 else{
						 var schemaBindInfoIDTempArr = [];
						 schemaBindInfoIDTempArr[0] = schemaBindInfoIDTemp;
		                 $.omcAjax("/cm/SchemaNodeBind/delete/bindInfoIDs", {"bindInfoIDs":schemaBindInfoIDTempArr}, function (data) {                //删除绑定关系
		                        if (data.success == false) {
		           				    topo.Util.failTip(data,Msg.topocfg.deletesigbindshipfail);  	// 删除信号绑定关系失败
		                            return false;
		                        }
		                        else{
		                        	selectednode.setClient("schemaBindInfoID","");
		                        	topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"3",nodeInfo,self.box,self.curConfSchemaObj);
		                        }
						 
					     },false);
					 }
		    	 }
		    	 else if(self.signalflag == 1){             //一般遥�?
		    		 var schemaBindInfoIDTemp = selectednode.getClient("ykschemaBindInfoID");                                          //没有绑定信号
					 if((schemaBindInfoIDTemp == null) || (schemaBindInfoIDTemp == undefined) ||(schemaBindInfoIDTemp == "")){
						 topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"4",nodeInfo,self.box,self.curConfSchemaObj);  
					 }
					 else{
						 var schemaBindInfoIDTempArr = [];
						 schemaBindInfoIDTempArr[0] = schemaBindInfoIDTemp;
		                 $.omcAjax("/cm/SchemaNodeBind/delete/bindInfoIDs", {"bindInfoIDs":schemaBindInfoIDTempArr}, function (data) {                //删除绑定关系
		                        if (data.success == false) {
		           				    topo.Util.failTip(data,Msg.topocfg.deletesigbindshipfail);  	// 删除信号绑定关系失败
		                            return false;
		                        }
		                        else{
		                        	selectednode.setClient("ykschemaBindInfoID","");
		                        	topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"4",nodeInfo,self.box,self.curConfSchemaObj);
		                        }
						 
					     },false);
					 }
		    	 }
		    	 else if(self.signalflag == 2){             //遥控开�?
		    		 var schemaBindInfoIDTemp = selectednode.getClient("ykkqschemaBindInfoID");                                          //没有绑定信号
					 if((schemaBindInfoIDTemp == null) || (schemaBindInfoIDTemp == undefined) ||(schemaBindInfoIDTemp == "")){
						 topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"5",nodeInfo,self.box,self.curConfSchemaObj);  
					 }
					 else{
						 var schemaBindInfoIDTempArr = [];
						 schemaBindInfoIDTempArr[0] = schemaBindInfoIDTemp;
		                 $.omcAjax("/cm/SchemaNodeBind/delete/bindInfoIDs", {"bindInfoIDs":schemaBindInfoIDTempArr}, function (data) {                //删除绑定关系
		                        if (data.success == false) {
		           				    topo.Util.failTip(data,Msg.topocfg.deletesigbindshipfail);  	// 删除信号绑定关系失败
		                            return false;
		                        }
		                        else{
		                        	selectednode.setClient("ykkqschemaBindInfoID","");
		                        	topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"5",nodeInfo,self.box,self.curConfSchemaObj);
		                        }
					     },false);
					 }
		    	 }
		    	 else{                                      //遥控关闭
		    		 var schemaBindInfoIDTemp = selectednode.getClient("ykgbschemaBindInfoID");                                          //没有绑定信号
					 if((schemaBindInfoIDTemp == null) || (schemaBindInfoIDTemp == undefined) ||(schemaBindInfoIDTemp == "")){
						 topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"6",nodeInfo,self.box,self.curConfSchemaObj); 
					 }
					 else{
						 var schemaBindInfoIDTempArr = [];
						 schemaBindInfoIDTempArr[0] = schemaBindInfoIDTemp;
		                 $.omcAjax("/cm/SchemaNodeBind/delete/bindInfoIDs", {"bindInfoIDs":schemaBindInfoIDTempArr}, function (data) {                //删除绑定关系
		                        if (data.success == false) {
		           				    topo.Util.failTip(data,Msg.topocfg.deletesigbindshipfail);  	// 删除信号绑定关系失败
		                            return false;
		                        }
		                        else{
		                        	selectednode.setClient("ykgbschemaBindInfoID","");
		                        	topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"6",nodeInfo,self.box,self.curConfSchemaObj);
		                        }
					     },false);
					 }
		    	 }
			}
			if((selectednode.getClient("nodetypeid") == 6)||(selectednode.getClient("nodetypeid") == 8) ||(selectednode.getClient("nodetypeid") == 67)){//组串
				var schemaBindInfoIDTemp = selectednode.getClient("schemaBindInfoID");                   //没有绑定信号
				if((schemaBindInfoIDTemp == null) || (schemaBindInfoIDTemp == undefined) ||(schemaBindInfoIDTemp == "")){
					//是否选择信号点的校验
					var zcSignalOpt = $("select[id^='zcsignalopt']");
					var selectValueTotol = "";
					var selectLen = zcSignalOpt.length ;
					for(var ki = 0 ; ki < selectLen ; ki++){
						selectValueTotol = selectValueTotol + $(zcSignalOpt[ki]).val();
					}
					if("" == selectValueTotol){
						 $("#alertmsg").html("");
		                 $("#alertmsg").html(Msg.topocfg.nochosesignal);                                 //没有选择信号
		                 $("#alertdlg").dialog("open");
		                 return false;
					}
					
					//构造client信息
					var returnflag = false;
					var selectvalue  = $("#selectedNode").val();                                         //选择对应的设备
					var arrselectvalue = selectvalue.split("@@");
			    	var deviceid = arrselectvalue[0];
			    	var hostnodeid = arrselectvalue[1];
			    	var devverid = arrselectvalue[2];
					var idFinder = new twaver.QuickFinder(self.box,"id");
					var hostnode = idFinder.find(hostnodeid).get(0);                                    //寻找对应的逆变器节点
					var i = 0;
					var signalcolnames = "";
					var signalnames = "";
					var signalids = "";
					var signalunits = "";
					var signaltypes = "";
					for(i = 0 ; i < selectLen ; i++){
						var arrsignalinfotemp = $(zcSignalOpt[i]).val().split("@@");
						var signalidtemp = "";                                  //信号ID
						var signalnametemp = "";                                //信号name
						var signalcolnametemp = "";                             //信号colName
						var signalunittemp = "";                                //信号unit
						var signaltypetemp = "";                                //信号类型
						if("" != $(zcSignalOpt[i]).val()){                            //选中
							signalidtemp = arrsignalinfotemp[0];                                 
							signalnametemp = arrsignalinfotemp[1];                               
							signalcolnametemp = arrsignalinfotemp[2];                            
							signalunittemp = arrsignalinfotemp[3];                                
							signaltypetemp = arrsignalinfotemp[4];                               
						}
						else{
							var counttemp1 = i + 1;
							signalidtemp = "-" + counttemp1 + "";                                 
							signalnametemp = "-" + counttemp1 +"";                               
							signalcolnametemp = "-" + counttemp1 +"";                            
							signalunittemp = "-" + counttemp1 +"";                                
							signaltypetemp = "-" + counttemp1 +"";   
						}
						if(i == 0){
							 signalcolnames = signalcolnametemp;
							 signalids = signalidtemp;
							 signalunits = signalunittemp;
							 signalnames = signalnametemp;
							 signaltypes = signaltypetemp;
						 }
						 else{
							 signalcolnames = signalcolnames + "," + signalcolnametemp;
							 signalids = signalids + "," + signalidtemp;
							 signalunits = signalunits + "," + signalunittemp;
							 signalnames = signalnames + "," + signalnametemp;
							 signaltypes = signaltypes + "," + signaltypetemp;
						 }
					}
					
					//构造与数据库操作数据
					for(var kn = 0 ; kn < selectLen ; kn++){
						var strtemp = $(zcSignalOpt[kn]).val();
						var arrsignalinfo = strtemp.split("@@");
						var signalid = "";                                  //信号ID
						if("" != strtemp){
							signalid = arrsignalinfo[0];                                 
						}
						var schemaNodeBindInfo = {}
						schemaNodeBindInfo.bindType = 2;
						schemaNodeBindInfo.parentNodeGuid = hostnodeid;
						schemaNodeBindInfo.pelNodeGuid = selectednode.getId();
						schemaNodeBindInfo.bindObjectId = signalid;
						schemaNodeBindInfo.schemaID = self.curConfSchemaObj.id;
				    	 var nodeInfo = {};
				    	 nodeInfo.hostnode = hostnode;
				    	 nodeInfo.selfnode = selectednode;
				    	 nodeInfo.signalid = signalids;
				    	 nodeInfo.signalname = signalnames;
				    	 nodeInfo.signalcolname = signalcolnames;
				    	 nodeInfo.signalunit = signalunits;
				    	 nodeInfo.signaltype = signaltypes;
				    	 if("" != strtemp){
				    		 returnflag = topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"3",nodeInfo,self.box,self.curConfSchemaObj);       //绑定信号（服务端�?
				    	 }
					}
                }
                else{
                	//是否选择信号点的校验
					var zcSignalOpt = $("select[id^='zcsignalopt']");
					var selectValueTotol = "";
					var selectLen = zcSignalOpt.length ;
					for(var ki = 0 ; ki < selectLen ; ki++){
						selectValueTotol = selectValueTotol + $(zcSignalOpt[ki]).val();
					}
					if("" == selectValueTotol){
						 $("#alertmsg").html("");
		                 $("#alertmsg").html(Msg.topocfg.nochosesignal);                                 //没有选择信号
		                 $("#alertdlg").dialog("open");
		                 return false;
					}
					
                	var schemaBindInfoIDTempArr = [];
                	if((schemaBindInfoIDTemp + "").indexOf(",") == -1){
                		schemaBindInfoIDTempArr[0] = schemaBindInfoIDTemp;
                	}
                	else{
                		schemaBindInfoIDTempArr = schemaBindInfoIDTemp.split(",");
                	}
                	$.omcAjax("/cm/SchemaNodeBind/delete/bindInfoIDs?capacity="+$("#inputDevCapacity").val(), {"bindInfoIDs":schemaBindInfoIDTempArr}, function (data) {                //删除绑定关系
                        if (data.success == false) {
           				    topo.Util.failTip(data,Msg.topocfg.deletesigbindshipfail);  	// 删除信号绑定关系失败
                            return false;
                        }
                        else{
                        	selectednode.setClient("schemaBindInfoID","");
        					//构造client信息
        					var returnflag = false;
        					var selectvalue  = $("#selectedNode").val();                                         //选择对应的设备
        					var arrselectvalue = selectvalue.split("@@");
        			    	var deviceid = arrselectvalue[0];
        			    	var hostnodeid = arrselectvalue[1];
        			    	var devverid = arrselectvalue[2];
        					var idFinder = new twaver.QuickFinder(self.box,"id");
        					var hostnode = idFinder.find(hostnodeid).get(0);                                    //寻找对应的逆变器节点
        					var i = 0;
        					var signalcolnames = "";
        					var signalnames = "";
        					var signalids = "";
        					var signalunits = "";
        					var signaltypes = "";
        					for(i = 0 ; i < selectLen ; i++){
        						var arrsignalinfotemp = $(zcSignalOpt[i]).val().split("@@");
        						var signalidtemp = "";                                  //信号ID
        						var signalnametemp = "";                                //信号name
        						var signalcolnametemp = "";                             //信号colName
        						var signalunittemp = "";                                //信号unit
        						var signaltypetemp = "";                                //信号类型
        						if("" != $(zcSignalOpt[i]).val()){                            //选中
        							signalidtemp = arrsignalinfotemp[0];                                 
        							signalnametemp = arrsignalinfotemp[1];                               
        							signalcolnametemp = arrsignalinfotemp[2];                            
        							signalunittemp = arrsignalinfotemp[3];                                
        							signaltypetemp = arrsignalinfotemp[4];                               
        						}
        						else{
        							var counttemp1 = i + 1;
        							signalidtemp = "-" + counttemp1 + "";                                 
        							signalnametemp = "-" + counttemp1 +"";                               
        							signalcolnametemp = "-" + counttemp1 +"";                            
        							signalunittemp = "-" + counttemp1 +"";                                
        							signaltypetemp = "-" + counttemp1 +"";   
        						}
        						if(i == 0){
        							 signalcolnames = signalcolnametemp;
        							 signalids = signalidtemp;
        							 signalunits = signalunittemp;
        							 signalnames = signalnametemp;
        							 signaltypes = signaltypetemp;
        						 }
        						 else{
        							 signalcolnames = signalcolnames + "," + signalcolnametemp;
        							 signalids = signalids + "," + signalidtemp;
        							 signalunits = signalunits + "," + signalunittemp;
        							 signalnames = signalnames + "," + signalnametemp;
        							 signaltypes = signaltypes + "," + signaltypetemp;
        						 }
        					}
        					
        					//构造与数据库操作数据
        					for(var kn = 0 ; kn < selectLen ; kn++){
        						var strtemp = $(zcSignalOpt[kn]).val();
        						var arrsignalinfo = strtemp.split("@@");
        						var signalid = "";                                  //信号ID
        						if("" != strtemp){
        							signalid = arrsignalinfo[0];                                 
        						}
        						var schemaNodeBindInfo = {}
        						schemaNodeBindInfo.bindType = 2;
        						schemaNodeBindInfo.parentNodeGuid = hostnodeid;
        						schemaNodeBindInfo.pelNodeGuid = selectednode.getId();
        						schemaNodeBindInfo.bindObjectId = signalid;
        						schemaNodeBindInfo.schemaID = self.curConfSchemaObj.id;
        				    	 var nodeInfo = {};
        				    	 nodeInfo.hostnode = hostnode;
        				    	 nodeInfo.selfnode = selectednode;
        				    	 nodeInfo.signalid = signalids;
        				    	 nodeInfo.signalname = signalnames;
        				    	 nodeInfo.signalcolname = signalcolnames;
        				    	 nodeInfo.signalunit = signalunits;
        				    	 nodeInfo.signaltype = signaltypes;
        				    	 if("" != strtemp){
        				    		 returnflag = topo.Util.sunDevOrBindSignal(schemaNodeBindInfo,selectedNode,"3",nodeInfo,self.box,self.curConfSchemaObj);       //绑定信号（服务端�?
        				    	 }
        					}
                        }
                    },false);
                }
			}
		},

		associateCalcSignalOKFun:function(selectedNode,self){
			var signalName = $('#calcSigSelect').val();
			var signalObject = $('#calcSigBelongSelect').val();
			if (!signalObject) {
                var calcSigBelongDiv = $('#calcSigBelongDiv');
                if (calcSigBelongDiv.is(':visible')) {
                	App.myMsg(Msg.topocfg.notChooseSignalObj);
                	return;
                }
			}
			if(signalName != undefined && signalName != '') {
				topo.Util.clearNodeClient(selectedNode);
				var signalModel = signalName.split("@@");
				selectedNode.setName(signalModel[0]);
				selectedNode.setClient("texttype", 3);
				selectedNode.setClient("signalname", signalModel[0]);
				selectedNode.setClient("signalunit", signalModel[1]);
				selectedNode.setClient("signalobject", signalObject);
				selectedNode.setClient("signalkind", signalModel[2]);
				var setting = new twaver.SerializationSettings();               
				self.setClientPropertyType(setting);
				var xmlSerializer = new twaver.XmlSerializer(self.box,setting);
				var ConfSchemaInfo = {};
				ConfSchemaInfo.schemaData = xmlSerializer.serialize();
				ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
				ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
				ConfSchemaInfo.id = self.curConfSchemaObj.id;
				$.omcAjax("/cm/ConfSchemaInfo/update",ConfSchemaInfo , function(data) {
					if(data.success == false){
						topo.Util.failTip(data,Msg.topocfg.updatetopofail);
					}
					else{
						
						$("#dlgChoAssNode" ).dialog("close");
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.savesuccess);      
						$("#alertdlg").dialog("open");
						self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
						self.curConfSchemaObj.timeStamp = data.data.timeStamp;
						
					}
				}); 
			}
		},
		
		changePicOKFun:function(self){
			var selectednode = self.network.getSelectionModel().getLastData();
			var selectvalue = $("#picPathSel").val();
			if(!selectvalue){
				 $("#alertmsg").html("");
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
			self.updateCurTopo();
		},
		
		associateDevOKFun:function(self){
			var selectednode = self.network.getSelectionModel().getLastData();
    		var nodetypeid = selectednode.getClient("nodetypeid");
    		var deviceinfo = $("#choosedev").val();
    		if(!deviceinfo){
				 $("#alertmsg").html("");
				 $("#alertdlg").dialog({height:180});
      	     	 $("#alertmsg").html(Msg.ztpz.pleaseSelectDev);                //请选择设备
	             $("#alertdlg").dialog("open");
	             return false;
			}
    		
            var schemaNodeBindInfo = {}
            if(nodetypeid == 13){
            	schemaNodeBindInfo.bindType = 4;                               //三相，两�?
            }
            else{
            	schemaNodeBindInfo.bindType = 1;                               //箱变，数采，逆变器，汇流箱，电表，环境仪
            }
		    schemaNodeBindInfo.parentNodeGuid = "";
			schemaNodeBindInfo.pelNodeGuid = selectednode.getId();
			schemaNodeBindInfo.bindObjectId = $("#choosedev").val().split("@@")[0];
			schemaNodeBindInfo.schemaID = self.curConfSchemaObj.id;
			
			//关联已有设备，然后更新(关联箱变)
			if(selectednode.getClient("nodetypeid")== 42){
				 schemaNodeBindInfo.parentDevName = $("#ascurinvs_associate1").find("option:selected").text(); 
			 }
			 if(selectednode.getClient("nodetypeid")== 44){
				 schemaNodeBindInfo.parentDevName = $("#ascurinvs_associate").find("option:selected").text();
			 }
			 if($("#ascurinvs_associate1").val() && (selectednode.getClient("nodetypeid") == 42)){
					schemaNodeBindInfo.parentDevID = $("#ascurinvs_associate1").val();
				}
				else if(selectednode.getClient("parentdevid") && (selectednode.getClient("nodetypeid") != 42))
				{
					schemaNodeBindInfo.parentDevID = selectednode.getClient("parentdevid");
				}
			if($("#ascurinvs_associate").val() && (selectednode.getClient("nodetypeid") == 44)){
				schemaNodeBindInfo.parentDevID = $("#ascurinvs_associate").val();
			}
			else if(selectednode.getClient("parentdevid") && (selectednode.getClient("nodetypeid") != 44))
			{
				schemaNodeBindInfo.parentDevID = selectednode.getClient("parentdevid");
			}
			
            topo.Util.assAvailDev(schemaNodeBindInfo, selectednode, self);
		},
		
		associateotherstationOKFun:function(self){
			var selectednode = self.network.getSelectionModel().getLastData();
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
			topo.Util.addOtherEMI(schemaNodeBindInfo,selectednode,self);
		},
		
		toolbarSave:function(self){
			var setting = new twaver.SerializationSettings();
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
	           		 self.curConfSchemaObj.timeStamp = data.data.timeStamp;
	           		 $("#alertdlg").dialog({height:180});
	           		 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.savesuccess);                 //保存成功
		             $("#alertdlg").dialog("open");
	           	 }
          	});
		},
		
		topoDeleteFun:function(self){
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
			var nums = 0;
			var numdevs = 0;
			selectNodes.forEach(function(e){                                 //当前选中节点
				var deviceid = e.getClient("deviceid");
				var nodetypeid =e.getClient("nodetypeid");
				var relationKeyId =e.getClient("relationKeyId");
				if(deviceid != null){
					numdevs++;
				}
				nums++;
				if((deviceid !=null) && (deviceid !=undefined) && (deviceid !="") && (nodetypeid == 18)){   //数采IP
					$.omcAjax("/cm/dev/information",{"devID":deviceid}, function(data) {
						 if(data.success == false){
							 $("#alertmsg").html("");
							 $("#alertmsg").html(Msg.topocfg.getdatacollectorinfofail);   //获取数据采集器信息失�?
							 $("#alertdlg").dialog("open");
							 return false;
					      }
					      if(data.success == true) {
					    	  if(data.data.ip){
					    		  shucaiips[j] = data.data.ip;
							      j++;
					    	  }
					      }
					},false);
				}
                // 含有环境监测仪的
				if(relationKeyId == undefined && nodetypeid == 21 && deviceid !=undefined){
					emiIds[k] = deviceid;
					k++;
				}
		    });
			
			var deletemsg = "";
			if(nums == 1){
				if(numdevs==0){
					deletemsg = Msg.topocfg.isdeletenode;
				}
				else{
					deletemsg = Msg.topocfg.delnodehavedev;
				}
			}
			else{
				if(numdevs==0){
					deletemsg = Msg.topocfg.havaselect+nums+Msg.topocfg.isdeletenodes;
				}
				else{
					deletemsg = Msg.topocfg.havaselect+nums+Msg.topocfg.delnodehavedevs;
				}
			}

			if(shucaiips.length == 0){                                       //没有数采
				var deletenodeids = [];
				var i = 0;
				selectNodes.forEach(function(e){
			        deletenodeids[i] = e.getId();
					i++;
			    });
				$.omcAjax("/cm/SchemaNodeBind/pels/hasEMIType5", {"devIds" : emiIds}, function(data) {
					if(!data.success){
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.getEMIinfofail);   //获取环境监测仪绑定信息失败
						$("#alertdlg").dialog("open");
					}
					if(data.success && data.data){
						App.myConfirm(deletemsg,
							function(){
								$('#overlay').show();
								$('#delLoading').show();
								$.omcAjax("/cm/SchemaNodeBind/pels/delete", {"pelIDs" : deletenodeids}, function(data) {           //后端删除图元逻辑
									if(data.success == false){
										$('#overlay').hide();
										$('#delLoading').hide();
										$("#alertmsg").html("");
										$("#alertmsg").html(Msg.topocfg.deletenodefail);                  //删除失败
										$("#alertdlg").dialog("open");
										return false;
									}
									if(data.success == true) {
										if(data.data == false){
											$('#overlay').hide();
											$('#delLoading').hide();
											App.myMsg(Msg.topocfg.siphunculus);
											return false;
										}
										for(var s = selectNodes.size()-1;s >= 0 ;s--){
											var nodetemp = selectNodes.get(s);
											if((nodetemp == null) || (nodetemp == undefined)||(nodetemp == "")){
												continue;
											}
											var nodetypeid = nodetemp.getClient("nodetypeid");
											if(nodetypeid && (nodetypeid == 5) || (nodetypeid == 13)||(nodetypeid == 18)||(nodetypeid == 15) || (nodetypeid == 16)||(nodetypeid == 39) || (nodetypeid == 21)|| (nodetypeid == 41)|| (nodetypeid == 44)|| (nodetypeid == 48)|| (nodetypeid == 49)|| (nodetypeid == 50)|| (nodetypeid == 52) || (nodetypeid == 56)){
												var followers = selectNodes.get(s).getFollowers();
												if(followers != null){
													var len = followers.size();
													for(var i = len - 1;i >= 0 ;i--){
														var tempfollowers = followers.get(i);
														if(tempfollowers){
															self.box.remove(followers.get(i));
														}
													}
												}
											}
											if(nodetypeid == 42){
												var followers = selectNodes.get(s).getFollowers();
												if(followers != null){
													var len = followers.size();
													for(var i = len - 1;i >= 0 ;i--){
														var tempfollowers = followers.get(i);
														if(tempfollowers){
															tempfollowers.setClient("parentdevid", "");
														}
													}
												}
											}
										}
										for(var s = selectNodes.size()-1;s >= 0 ;s--){
											var tempnode = selectNodes.get(s);
											if(tempnode){
												self.box.remove(selectNodes.get(s));
											}
										}
										var setting = new twaver.SerializationSettings();               //更新拓扑数据�?
										self.setClientPropertyType(setting);
										var xmlSerializer = new twaver.XmlSerializer(self.box,setting);
										var ConfSchemaInfo = {};
										ConfSchemaInfo.schemaData = xmlSerializer.serialize();
										ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
										ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
										ConfSchemaInfo.id = self.curConfSchemaObj.id;
										$.omcAjax("/cm/ConfSchemaInfo/update",ConfSchemaInfo , function(data) {
											if(data.success == false){
												$('#overlay').hide();
												$('#delLoading').hide();
												topo.Util.failTip(data,Msg.topocfg.updatetopofail);
											}
											else{
												$('#overlay').hide();
												$('#delLoading').hide();
												$("#alertmsg").html("");
												$("#alertmsg").html(Msg.topocfg.deletesuccess);                  //删除成功
												$("#alertdlg").dialog("open");
												self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
												self.curConfSchemaObj.timeStamp = data.data.timeStamp;
											}
										});
									}
								});
							}
						);

					}else{
						$('#overlay').hide();
						$('#delLoading').hide();
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.deleteEMIinfofail);   //要删除的环境监测仪纯在引用
						$("#alertdlg").dialog("open");
					}

				});



		}
		else{                                                                                   //有数采，询问后端存在有与其关联设�?
			$.omcAjax("/cm/dev/sameip", {"IPs" : shucaiips}, function(data) {
				if(data.success == false){
					 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.gethasassdatacollectordevfail);     //获取是否存在和当前删除数据采集器有关联的设备
					 $("#alertdlg").dialog("open");
				 }
				 else{
					 var listtemp = new twaver.List();
					 var relationTemp = 0;

					 for(var n = 0;n < selectNodes.size();n++){                        //图元建库的节�?
						var nodetypeidtemp = selectNodes.get(n).getClient("nodetypeid");
						//防止多个数采IP一�?
						if((nodetypeidtemp == 5) || (nodetypeidtemp == 15)|| (nodetypeidtemp == 16)|| (nodetypeidtemp == 39)|| (nodetypeidtemp == 41)|| (nodetypeidtemp == 42)|| (nodetypeidtemp == 21)|| (nodetypeidtemp == 44)|| (nodetypeidtemp == 48)|| (nodetypeidtemp == 49)|| (nodetypeidtemp == 50) || (nodetypeidtemp == 52)){
							listtemp.add(selectNodes.get(n));
						}
					 }
					 var dataarr = data.data;                                          //返回的数据库的具有选中数采的IP相同的集�?
					 var deleteFlay = true;
					 var count = 0;
					 var devnotshucai = 0;
					 for (var m = 0;m < dataarr.length ;m++){                          //查询设备
						 if(2 == dataarr[m].devTypeId){                                //数采排除
							 continue;
						 }
						 devnotshucai++;
					 	 for (var k = 0;k < listtemp.size();k++){
							 var temp = listtemp.get(k);
					 		 if ( temp.getClient("relationKeyId") == undefined && temp.getClient("deviceid")== dataarr[m].id) {     //框选设备是框选数采的下级设备
					 			 count++;
					 		 }
					 	 }
					 }
					 if(count == devnotshucai){
						 	deleteFlay = true;
					 }
					 else{
					 	deleteFlay = false;
					 }
					 if (deleteFlay){      // 可以�?
							var deletenodeids = [];
							var i = 0;
							selectNodes.forEach(function(e){
						        deletenodeids[i] = e.getId();
								i++;
						    });
						 selectNodes.forEach(function(e){
							 var relationKeyId =e.getClient("relationKeyId"); // 获取EMI绑定关系
							 var deviceid = e.getClient("deviceid");
							 var nodetypeid =e.getClient("nodetypeid");
							 // 含有环境监测仪的
							 if(relationKeyId == undefined && nodetypeid == 21 && deviceid !=undefined){
								 emiIds[relationTemp] = deviceid;
								 relationTemp++;
							 }
						 });
						 $.omcAjax("/cm/SchemaNodeBind/pels/hasEMIType5", {"devIds" : emiIds}, function(data) {
							 if (!data.success) {
								 $("#alertmsg").html("");
								 $("#alertmsg").html(Msg.topocfg.getEMIinfofail);   //获取环境监测仪绑定信息失败
								 $("#alertdlg").dialog("open");
							 }
							 if(data.success && data.data) {
								 App.myConfirm(deletemsg,
									 function(){
									 	$('#overlay').show();
										$('#delLoading').show();
										$.omcAjax("/cm/SchemaNodeBind/pels/delete", {"pelIDs": deletenodeids}, function (data) {           //后端删除图元逻辑
											if (data.success == false) {
												 $('#overlay').hide();
												 $('#delLoading').hide();
												 $("#alertmsg").html("");
												 $("#alertmsg").html(Msg.topocfg.deletenodefail);             //删除图元失败
												 $("#alertdlg").dialog("open");
												 return false;
											 }
											 if (data.success == true) {
												 for (var s = selectNodes.size() - 1; s >= 0; s--) {
													 var nodetemp = selectNodes.get(s);
													 if ((nodetemp == null) || (nodetemp == undefined) || (nodetemp == "")) {
														 continue;
													 }
													 var nodetypeid = nodetemp.getClient("nodetypeid");
													 if (nodetypeid && (nodetypeid == 5) || (nodetypeid == 18) || (nodetypeid == 13) || (nodetypeid == 15) || (nodetypeid == 16) || (nodetypeid == 39) || (nodetypeid == 21) || (nodetypeid == 41) || (nodetypeid == 42) || (nodetypeid == 44) || (nodetypeid == 48) || (nodetypeid == 49) || (nodetypeid == 50)|| (nodetypeid == 52)) {
														 var followers = selectNodes.get(s).getFollowers();
														 if (followers != null) {
															 var len = followers.size();
															 for (var i = len - 1; i >= 0; i--) {
																 var tempfollowers = followers.get(i);
																 if (tempfollowers) {
																	 self.box.remove(followers.get(i));
																 }
															 }
														 }
													 }
												 }
												 for (var s = selectNodes.size() - 1; s >= 0; s--) {
													 var tempnode = selectNodes.get(s);
													 if (tempnode) {
														 self.box.remove(selectNodes.get(s));
													 }
												 }
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
														 $('#overlay').hide();
														 $('#delLoading').hide();
														 topo.Util.failTip(data, Msg.topocfg.updatetopofail);
													 }
													 else {
														 $('#overlay').hide();
														 $('#delLoading').hide();
														 $("#alertmsg").html("");
														 $("#alertmsg").html(Msg.topocfg.deletesuccess);      //删除成功
														 $("#alertdlg").dialog("open");
														 self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
														 self.curConfSchemaObj.timeStamp = data.data.timeStamp;
													 }
												 });
											 }
										 });
								 	}
								 );
							 }else{
								 $('#overlay').hide();
								 $('#delLoading').hide();
								 $("#alertmsg").html("");
								 $("#alertmsg").html(Msg.topocfg.deleteEMIinfofail);   //要删除的环境监测仪纯在引用
								 $("#alertdlg").dialog("open");
							 }
						 });

					 }
					 else{
						 $('#overlay').hide();
						 $('#delLoading').hide();
						 $("#alertmsg").html("");
						 $("#alertmsg").html(Msg.topocfg.deletedatacollectortip);                       //要删除的数据采集器有与其关联设备，不能删�?
						 $("#alertdlg").dialog("open");
					 }
					 
				 }
			});
		}
			
		},
		
		removeBindFun:function(lastData,self){
			var idarr = [];
			idarr[0] = lastData.getId();
			if(lastData instanceof topo.JZNiBianQi){
				var datatemp = lastData.getFollowers();
				if(datatemp != null && datatemp.size() > 0){
					for(var i = 0;i < datatemp.size();i++){
						var datatempzl = datatemp.get(i);
						if(!(datatempzl instanceof topo.ZLHuiLiuXiang)){
							idarr[i+1] = datatemp.get(i).getId();
						}
					}
				}
				$.omcAjax("/cm/SchemaNodeBind/delete/nodeids", {"nodeidarr":idarr}, function (data) {
					if(data.success == false){
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.removebindfail);                          //解除绑定失败
						$("#alertdlg").dialog("open");
					}
					else{
						var datas = lastData.getFollowers();
						if(datas && datas.size() > 0){             //主要考虑setHost(NUll)用不了才考虑删一个，加一个这种方�?
							for(var s = datas.size()-1;s >= 0 ;s--){
								if(!(datas.get(s) instanceof topo.ZLHuiLiuXiang)){
									if(datas.get(s) instanceof topo.Text){
										topo.Util.clearNodeClient(datas.get(s));
										datas.get(s).setName("Text");
									}
									if(datas.get(s) instanceof topo.GuangZiPai){
										var objtemp = topo.Util.instanceObjByName(datas.get(s));
										self.box.remove(datas.get(s));
										objtemp.setName(Msg.topocfg.guangzipai);
										self.box.add(objtemp);
									}
								}else{
									datas.get(s).setClient("parentdevid", "");
									datas.get(s).setClient("parentdevName", "");
								}
							}
						}
						var objhost = topo.Util.instanceObjByName(lastData);        //主图�?
						self.box.remove(lastData);
						self.box.add(objhost);
						var setting = new twaver.SerializationSettings();             //更新拓扑�?
						self.setClientPropertyType(setting);
						var xmlSerializer = new twaver.XmlSerializer(self.box, setting);
						var ConfSchemaInfo = {};
						ConfSchemaInfo.schemaData = xmlSerializer.serialize();
						ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
						ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
						ConfSchemaInfo.id = self.curConfSchemaObj.id;
						$.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {                   //保存拓扑图ID
							if (data.success == false) {
								topo.Util.failTip(data,Msg.topocfg.updatetopofail);
							}
							else {
								self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
								self.curConfSchemaObj.timeStamp = data.data.timeStamp;
								$("#alertmsg").html("");
								$("#alertmsg").html(Msg.topocfg.savesuccess);                                      //保存成功
								$("#alertdlg").dialog("open");
							}
						});
					}
					
				});
			}else{
				var datatemp = lastData.getFollowers();
				if(datatemp != null && datatemp.size() > 0){
					for(var i = 0;i < datatemp.size();i++){
						idarr[i+1] = datatemp.get(i).getId();
					}
				}
				$.omcAjax("/cm/SchemaNodeBind/delete/nodeids", {"nodeidarr":idarr}, function (data) {
					if(data.success == false){
						$("#alertmsg").html("");
						$("#alertmsg").html(Msg.topocfg.removebindfail);                          //解除绑定失败
						$("#alertdlg").dialog("open");
					}
					else{
						var datas = lastData.getFollowers();
						if(datas && datas.size() > 0){             //主要考虑setHost(NUll)用不了才考虑删一个，加一个这种方�?
							for(var s = datas.size()-1;s >= 0 ;s--){
								var objtemp = topo.Util.instanceObjByName(datas.get(s));
								self.box.remove(datas.get(s));
								if(objtemp instanceof topo.Text){
									objtemp.setName("Text");
								}
								if(objtemp instanceof topo.GuangZiPai){
									objtemp.setName(Msg.topocfg.guangzipai);
								}
								if(objtemp instanceof topo.Shelf23){
									objtemp.setName("");
								}
								if(objtemp instanceof topo.Shelf22){
									objtemp.setName("");
								}
								self.box.add(objtemp);
							}
						}
						var objhost = topo.Util.instanceObjByName(lastData);        //主图�?
						self.box.remove(lastData);
						self.box.add(objhost);
						var setting = new twaver.SerializationSettings();             //更新拓扑�?
						self.setClientPropertyType(setting);
						var xmlSerializer = new twaver.XmlSerializer(self.box, setting);
						var ConfSchemaInfo = {};
						ConfSchemaInfo.schemaData = xmlSerializer.serialize();
						ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
						ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
						ConfSchemaInfo.id = self.curConfSchemaObj.id;
						$.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {                   //保存拓扑图ID
							if (data.success == false) {
								topo.Util.failTip(data,Msg.topocfg.updatetopofail);
							}
							else {
								self.curConfSchemaObj.schemaData = xmlSerializer.serialize();
								self.curConfSchemaObj.timeStamp = data.data.timeStamp;
								$("#alertmsg").html("");
								$("#alertmsg").html(Msg.topocfg.savesuccess);                                      //保存成功
								$("#alertdlg").dialog("open");
							}
						});
					}
					
				});
			}
		},
		
		unassociateTopoFun:function(lastData,self){
			var topographid = lastData.getClient("topographid");
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
			self.updateCurTopo();
		},
		
		//获取集控全部电站 iss 是否是第一次进入
		getComcStation:function(self,lastData,flag,iss){
			$("#plechaosestation").html("");
			$.omcAjax("/stationStatus/getActiveStation",{},function(res){
				if(res.success && res.data && res.data.length>0){
					var opt = "<option value = '0' slected class='text'>" + Msg.topocfg.plechaosestation + "</option>";
					$("#plechaosestation").append(opt);
					var data = res.data;
					if(data && data.length > 0){
						for(var i = 0 ; i < data.length ; i++){
							var strOpt = "<option value='"+ data[i].stationNumber +"'>"+data[i].name+"</option>"
							$("#plechaosestation").append(strOpt);
						}
						topoComon.getDevsByCondition(self,lastData,flag,iss);
					}
				}else{
					$("#alertdlg").dialog({height:180});
     	        	$("#alertmsg").html("");
     	        	$("#alertmsg").html(Msg.topocfg.noavailassdev);        //没有可关联设�?
		            $("#alertdlg").dialog("open");
		            $("#selectedSignal1").html("");
     	        	return false;
				}
			});
		},
		//获取分区和子阵
		
		getAllArea:function(self,lastData,flag){                                              //获取所有分区       
			$("#choFenQu").html("");
			$.omcAjax("/subarray/getSelect", {
				"typeId" : 1,
				"subareaId" : "",
				"subarrayId" : ""
			}, 
			function(res) {
				if(res.success == true){
					var opt = "<option value = '0' slected class='text'>" + Msg.topocfg.allfenqu + "</option>";
					$("#choFenQu").append(opt);
					var data = res.data.fenquList;
					if(data && data.length > 0){
						for(var i = 0 ; i < data.length ; i++){
							var strOpt = "<option value='"+ data[i].id +"'>"+data[i].name+"</option>"
							$("#choFenQu").append(strOpt);
						}
					}
					topoComon.getAllSubMartix(self,lastData,flag);
				}
				else{
					App.myMsg(Msg.opticaltracking.getareainfofail);             //获取分区信息失败
				}
			});
		},

		getAllSubMartix:function(self,lastData,flag){                                             //获取分区对应的子阵
			$("#choZiZhen").html("");
			if(0 == $("#choFenQu").val()){
				$("#choZiZhen").append("<option value = '0' selected class='text'>" + Msg.topocfg.allzizhen + "</option>");        //全部子阵
				//获取对应的设备
				topoComon.getDevsByCondition(self,lastData,flag);
				return;
			}
			$.omcAjax("/subarray/getSelect", {
				"typeId" : 1,
				"subareaId" : $("#choFenQu").val(),
				"subarrayId" : ""
			}, 
			function(res) {
				if(res.success == true){
					var data = res.data.zizhenList;
					$("#choZiZhen").append("<option value = '0' selected class='text'>" + Msg.topocfg.allzizhen + "</option>");   //全部子阵
					if(data && data.length > 0){
						for(var i = 0 ; i < data.length ; i++){
							var strOpt = "<option value='"+ data[i].id +"'>"+data[i].name+"</option>"
							$("#choZiZhen").append(strOpt);
						}
					}
					//获取对应的设备
					topoComon.getDevsByCondition(self,lastData,flag);
				}
				else{
					App.myMsg(Msg.opticaltracking.getsubmatrix);                 //获取子阵信息失败
				}
			});
		},
		
		/**
		 * 获取设备
		 */
		getDevsByCondition:function(self,lastData,flag,iss){
			var runMode = parent.Cookies.get('ComcMode');
			var url = "/cm/dev/getDevsByFenQuZizhen";
			var parm = {};
			if(runMode && runMode=='COMC'){
				//根据电站编号
				url = "/cm/dev/getDevsByStation";
				parm.stationCode = $("#plechaosestation").val();
			}
			if(!runMode || runMode!='COMC'){
				url = "/cm/dev/getDevsByFenQuZizhen";
				parm.areaid = $("#choFenQu").val();
				parm.submatrixid = $("#choZiZhen").val();
			}
			$("#selectedNode").html("")
			var bindInfo = {};
			var subAreaId = 0;
			var subMatrixId = 0;
			$.omcAjax(url,parm, function(data) {
				 if(data.success == false){
					 $("#alertdlg").dialog({height:180});
					 $("#alertmsg").html("");
					 $("#alertmsg").html(Msg.topocfg.getdevlistfail);          //获取设备列表失败
		             $("#alertdlg").dialog("open");
					 return false;
				 }
				 if(data.success == true){
					 var datadevs = data.data;
					 if(datadevs != null){
						 var isRemove = false;
						 var curCode = 0;
						 for(var i = 0;i < datadevs.length; i++){
							 var deviceid = datadevs[i].id                      
			     	         var modelversionID = datadevs[i].modelVersionId;
			     	         var name = datadevs[i].name;
			     	         if(deviceid == lastData.getClient("deviceid")){
			     	        	 $("#selectedNode").append("<option scode='"+datadevs[i].stationCode+"' value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' selected>"+name+"</option");
			     	        	if(runMode && runMode=='COMC'){
			     	        		curCode = datadevs[i].stationCode;
			     	        		isRemove = true;
			     	        	}
			     	         }
			     	         else{
			     	        	 $("#selectedNode").append("<option scode='"+datadevs[i].stationCode+"' value='"+deviceid+"@@"+" "+"@@"+modelversionID+"' >"+name+"</option");
			     	         }
			     	         if(isRemove && curCode!=0 && iss && iss==1){
			     	        	$('#plechaosestation').val(curCode);
			     	        	$('#selectedNode').find('option[scode!="'+curCode+'"]').remove();
			     	         }
						 }
					 }
					 if($("#selectedNode").html() == ""){
							$("#alertdlg").dialog({height:180});
		     	        	$("#alertmsg").html("");
		     	        	$("#alertmsg").html(Msg.topocfg.noavailassdev);        //没有可关联设�?
				            $("#alertdlg").dialog("open");
				            $("#selectedSignal1").html("");
		     	        	return false;
		     	     }
		     	     else{
			     	    	$("#choDevName").show();
	     		  			$("#choVerName").hide();
			     	    	self.signalflag = flag;
				     	    self.devChooseChange(self.curselectnode,self.signalflag,false);                                                         //根据选择的设备，来显示不同的信号
		     	     }
				 }
			 });
		},
		
		//分区改变事件
		 fenQuChange:function(self,lastData,flag){
			 topoComon.getAllSubMartix(self,lastData,flag);
		 },
		 
		//子阵改变事件
		 ziZhenChange:function(self,lastData,flag){
			 topoComon.getDevsByCondition(self,lastData,flag);
		 },
		 
		 //点击设备时保存topo图
		 devNodeChoseUpdateXML:function(deviceid,e,self){
			 var ip = e.element.getClient("ip");
			 var secondaddress = e.element.getClient("secondaddress");
			 var ESN = e.element.getClient("ESN");
			 var devicePort = e.element.getClient("devicePort");
			 var parentDevNamed = e.element.getClient("parentdevName");
			 var flag = false;
       		$.omcAjax("/cm/dev/information",{"devID":deviceid}, function (data) {                               //更新
					 if(data.success == false){
						
	     			 }
	     			 if(data.success == true){
	     				 var parentId = data.data.elecParentId;
	     				 if (parentId) {
		     				 $.omcAjax("/subarray/getParentDev",{"devId":deviceid},function(res) {//属性
	     						 if(res.success) {
	     							var parentDev = res.data.parentDev;
	     							var parentDevName = parentDev.name;
	     							e.element.setClient("parentdevName",parentDevName);//所关联设备
	     						 }
	     					 }); 
						} 
	     				if(data.data.ip){
	     					e.element.setClient("ip",data.data.ip);
			    	    } 
	  				    if(data.data.protocolAddr || "0" == data.data.protocolAddr){
	  					   e.element.setClient("secondaddress",data.data.protocolAddr);
				    	} 
	  				    if(data.data.ESN){
	  					   e.element.setClient("ESN",data.data.ESN);
				    	}
	  				   if(data.data.port){
	  					   e.element.setClient("devicePort",data.data.port);
				       } 
	  				   if(parentDevNamed != e.element.getClient("parentdevName")){
	  					   flag = true;
                       }
	  				   if(ip != e.element.getClient("ip")){
	  					   flag = true;
	  				   }
	  				   if(secondaddress != e.element.getClient("secondaddress")){
	  					   flag = true;
	  				   }
	  				   if(ESN != e.element.getClient("ESN")){
	  					   flag = true;
	  				   }
	  				   if(devicePort != e.element.getClient("devicePort")){
	  					   flag = true;
	  				   }
	  				   if(flag){
		  					var ConfSchemaInfo = {};
		      		        ConfSchemaInfo.schemaData = self.getTopoXmlData();
		      		        ConfSchemaInfo.busiObjectId = self.curConfSchemaObj.busiObjectId;
		      		        ConfSchemaInfo.schemeTypeId = self.curConfSchemaObj.schemeTypeId;
		      		        ConfSchemaInfo.id = self.curConfSchemaObj.id;
		      		        $.omcAjax("/cm/ConfSchemaInfo/update", ConfSchemaInfo, function (data) {
		      		            if (data.success == false) {
		      		            	
		      		            }
		      		            else {
		      		            	 self.curConfSchemaObj.schemaData = self.getTopoXmlData();
		      		            	 self.curConfSchemaObj.timeStamp = data.data.timeStamp;
		      		            }
		      		        });
	  				   }
     			 }
       		});
		 }
		 
		 
		
		
}