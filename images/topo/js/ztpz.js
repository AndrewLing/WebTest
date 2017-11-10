;$(function () {
    mac.setLanguage();
    var curConfSchema = {};
    // topo configuration
    var topoConfiguration = new TopoConfiguration();
    topoConfiguration.init();
    var strLengthLimit = 64;
    var ztpzLayout = $('body').fadeIn('fast').layout({
        defaults: {
            slidable: false
        },
        north: {
            resizable: false,
            maxSize: 52,
            spacing_closed: 1,
            spacing_open: 0,
            togglerLength_closed:  "100%",
            fxSpeed : 1,
            initClosed: true,
            onresize: function(){
            	topoConfiguration.sheet.invalidate();    //刷新配置属瀨h单
            	topoConfiguration.network.invalidate();
            },
            togglerTip_closed: function(){
            	topoConfiguration.sheet.invalidate();    
            	topoConfiguration.network.invalidate();
            },
            togglerTip_open: function(){
            	topoConfiguration.sheet.invalidate();    
            	topoConfiguration.network.invalidate();
            }
        },
        west: {
            size: 350,
            childOptions: {
                north: {
                    size: 65,
                    resizable: false,
                    spacing_closed: 0,
                    spacing_open: 0,
                    togglerLength_closed:  "100%",
                    fxSpeed : 0
                },
                south: {
                    childOptions:{
                        north: {
                            resizable: false,
                            spacing_closed: 0,
                            spacing_open: 0,
                            togglerLength_closed:  "100%",
                            fxSpeed : 0
                        },
                        center: {
                            size: 70,
                            resizable: false,
                            spacing_closed: 0,
                            spacing_open: 0,
                            togglerLength_closed:  "100%",
                            fxSpeed : 0
                        }
                    }
                }
            },
            onresize: function(){
            	topoConfiguration.sheet.invalidate();    //刷新配置属瀨h单
            	topoConfiguration.network.invalidate();
            },
            togglerTip_closed: function(){
            	topoConfiguration.sheet.invalidate();    
            	topoConfiguration.network.invalidate();
            },
            togglerTip_open: function(){
            	topoConfiguration.sheet.invalidate();    
            	topoConfiguration.network.invalidate();
            }
        
        },
        east: {
            size: 400,
            childOptions: {
                resizable: true,
                onresize: function(){
                    //$('#sunArea').parent().css('height', $('#sunshine').height() - 70).css('overflow-y', 'auto');
                },
                center: {
                    childOptions:{
                        north: {
                            resizable: false,
                            spacing_closed: 0,
                            spacing_open: 0,
                            togglerLength_closed:  "100%",
                            fxSpeed : 0
                        },
                        center: {
                            resizable: false,
                            spacing_closed: 0,
                            spacing_open: 0,
                            togglerLength_closed:  "100%",
                            fxSpeed : 0
                        }
                    }
                },
                south: {
                    childOptions:{
                        north: {
                            resizable: false,
                            spacing_closed: 0,
                            spacing_open: 0,
                            togglerLength_closed:  "100%",
                            fxSpeed : 0
                        },
                        center: {
                            resizable: false,
                            spacing_closed: 0,
                            spacing_open: 0,
                            togglerLength_closed:  "100%",
                            fxSpeed : 0
                        }
                    }
                }
            },
            onresize: function(){
            	topoConfiguration.sheet.invalidate();
            	topoConfiguration.network.invalidate();
            },
            togglerTip_closed: function(){
            	topoConfiguration.sheet.invalidate();    
            	topoConfiguration.network.invalidate();
            },
            togglerTip_open: function(){
            	topoConfiguration.sheet.invalidate();    
            	topoConfiguration.network.invalidate();
            }
        }
    });

    if(parent.hideHead == true){
        ztpzLayout.close('north');
    } else {
        ztpzLayout.open('north');
    }

    // 修复在主界面隐藏上方按钮，进来后组态部件的内容上移的bug
    ztpzLayout.resizeAll();
    $('#yincang').on('click', function(){
        if(parent.hideHead == true) {
            parent.hideHead = false;
            ztpzLayout.close('north');
        } else if(parent.hideHead == false){
            parent.hideHead = true;
            ztpzLayout.open('north');
        }
    });

    $( "#ztpz-conf-tabs" ).tabs({ active: 0 });
    $( "#pic-accordion").accordion({ active: 0 });
    $( "#character-accordion").accordion({ active: 0 });

    // topo tree
    var url = '/cm/topoNodes';
    var topoTreeSetting = {
        view: {
            showLine: false,
            selectedMulti: false,
            dblClickExpand: false,
            nameIsHTML:false
        },
        edit: {
//            enable: true,
            enable: false,
            showRemoveBtn: false,
            showRenameBtn: false,
            drag: {
                isMove: true,
                prev: true,
                inner: true,
                next: true
            }
        },
        callback: {
            beforeDrag: function (treeId, treeNodes) {
                var dragNode = treeNodes[0];
                if (dragNode.parentId == 0) {
                    return false;
                }
            },
            onDrag: function () {

            },
            beforeDrop: function () {

            },
            onDrop: function (event, treeId, treeNodes, targetNode, moveType) {
            },
            onClick: loadTopoData
        }
    };

    /**
     * 获取电站并网类型 1-大型地面电站 2-分布式电站
     */
    var stationType;//电站类型
    function checkStationType(){
        $.omcHttp.GET('/cm/topoNodes/getStationType', function(res){
            if(res.data && res.success){
            	stationType = res.data;
            } 
        });
    }

    var topoTree;
    var refSelectNode = {};
    function refreshNodeTree() {
        $.omcHttp.GET('/cm/topoNodes', function (res) {
            var data = res.data;
            $.fn.zTree.init($('#topoTree'), topoTreeSetting, data);
            topoTree = $.fn.zTree.getZTreeObj('topoTree');
            checkStationType();
            if(refSelectNode){
            	var node = topoTree.getNodeByParam("id", refSelectNode.id, null);
            	if(refSelectNode && refSelectNode.open){
            		node.open = refSelectNode.open;
            		topoTree.refresh();
            	}
            	topoTree.selectNode(node);
            	refSelectNode ={};
            }
        });
    }
    
    refreshNodeTree();
    var oldtreeid = "";
    function loadTopoData(event, treeId, treeNode) {

    	//var newtreeid = treeNode.id;                                //区分切换时是否ꀤح同丿ʂ炿

    	topoConfiguration.network.setDefaultInteractions();
    	var newtreeid = treeNode.id;                                //鍖哄垎鍒囨崲鏃舵槸鍚﹂�涓悓涓�妭鐐�

    	if(newtreeid == oldtreeid){
    		return ;
    	}
    	else{
    		oldtreeid = newtreeid;
    	}
        var parentId = treeNode.parentId;
        var nodetype = treeNode.type;
        topoConfiguration.parentTreeNodeId = parentId;
        topoConfiguration.treenodetype = nodetype;
        topoConfiguration.network.setZoom(1);
        topoConfiguration.network.invalidate();
        if(parentId != 0){                                         //非电站节点，显示工具栿
        	$('#overlay').css('opacity','0.0');
        	$('#overlay').show();
        	$('#delLoading').show();
            $.omcHttp.GET(url + '/' + treeNode.id + '/confSchema', function (res) {
                var confSchemaBackend = res.data;
                if(confSchemaBackend == "no data"){
                	App.myMsg(Msg.ztpz.err.hasRemoved);//该节点已被其它客户端用户删除
                    topoTree.removeNode(treeNode);
                    $('#overlay').hide();
                    $('#overlay').css('opacity','0.8');
                	$('#delLoading').hide();
                }
                else{
                	if((confSchemaBackend.schemaData != null) && (confSchemaBackend.schemaData.indexOf("layer id='1'") == -1) ){
                		 $.omcHttp.POST('/brow/getSysVersion',{}, function (res) {       //通过版本来确定升级时是否需要对指定节点偏移
                			 if(res.success == false){
            		       		 App.myMsg(Msg.topocfg.getversionfail);
            		       		 $('#overlay').hide();
            		       		 $('#overlay').css('opacity','0.8');
                             	 $('#delLoading').hide();
            		       		 return false;
            		       	 }
            		       	 else{
            		       		var boxtemp = new ElementBox();
                           	    var xmltemp = confSchemaBackend.schemaData;                                               
                           	    //confSchemaBackend.schemaData = xmltemp.replace("version='1.7.0'","version='5.2.4'");
                           	    var setting = new twaver.SerializationSettings();                            
                           	    topoConfiguration.setClientPropertyType(setting);
                    		    var xmlSerializer1 = new twaver.XmlSerializer(boxtemp,setting);
                    		    xmlSerializer1.deserialize(confSchemaBackend.schemaData, null);
                    		    var layerBox = boxtemp.getLayerBox();
                    		    if(layerBox.size() != 3){
                    		    	 var layer1 = new twaver.Layer("1");
                                	 var layer2 = new twaver.Layer("2");
                                	 layerBox.add(layer1);
                                	 layerBox.add(layer2);
                    		    }
                    		    var listtemp = layerBox.toDatas();
                    		    var isNeedOffset = false;
                    		    if(res.data.patchVersion == "eSCS910V100R002C00SPC018"){
                    		    	isNeedOffset = true;
                    		    }
                    		    boxtemp.getDatas().forEach(function(e){
                    		    	 if(!(e instanceof topo.ImageNode)){
        	          	    			  if(e instanceof topo.Text){
        	          		  	  			  e.setLayerId(listtemp.get(2).getId());
        	          		  	  		  }
        	          		  		  	  else{
        	          		  		  		  if(isNeedOffset){        //X5升级上来
			        	          		  		  	  if(e instanceof topo.ZLHuiLiuXiang){
			      	          		  		  			  e.setLocation(e.getLocation().x,e.getLocation().y + 16);
			      	          		  		  		  }
			      		          		  		  	  if(e instanceof topo.ZLHuiLiuXiang3D){
			      	         		  		  			  e.setLocation(e.getLocation().x,e.getLocation().y + 32);
			      	         		  		  		  }
			      			          		  		  if(e instanceof topo.JLHuiLiuXiang3D){
			      	         		  		  			  e.setLocation(e.getLocation().x,e.getLocation().y + 32);
			      	         		  		  		  } 
        	          		  		  		  }
        	          		  		  		  e.setLayerId(listtemp.get(1).getId());
        	          		  		  	  }
                  	    		     }
                    		    });  
                    	         var xmlSerializer2 = new twaver.XmlSerializer(boxtemp,setting);
                    	         var ConfSchemaInfo = {};
                    	         ConfSchemaInfo.schemaData = xmlSerializer2.serialize();
                    	         ConfSchemaInfo.busiObjectId = confSchemaBackend.busiObjectId;
                    	         ConfSchemaInfo.schemeTypeId = confSchemaBackend.schemeTypeId;
                    	         ConfSchemaInfo.id = confSchemaBackend.id;
                    	         ConfSchemaInfo.isNeedLog = "no";
                    	         confSchemaBackend.schemaData = xmlSerializer2.serialize();
                    	    	 $.omcAjax("/cm/ConfSchemaInfo/update",ConfSchemaInfo , function(data) {
                    		       	 if(data.success == false){
                    		       		 App.myMsg(data,Msg.topocfg.updatetopofail);
                    		       		 $('#overlay').hide();
                    		       		 $('#overlay').css('opacity','0.8');
                                     	 $('#delLoading').hide();
                    		       		 return false;
                    		       	 }
                    		       	 else{
                    		       		curConfSchema = confSchemaBackend;
                                        topoConfiguration.newConfSchemaObj = confSchemaBackend;
                                        topoConfiguration.istopnode = false;
                                        topoConfiguration.changeToolBar(false,nodetype);                  
                                        topoConfiguration.changeTreeNode();
                                    	$('#overlay').hide();
                                    	 $('#overlay').css('opacity','0.8');
                                     	$('#delLoading').hide();
                    		       	 }
                    	       	},false); 
            		       	 }
                		 });
                	}
                	else{
                		curConfSchema = confSchemaBackend;
                        topoConfiguration.newConfSchemaObj = confSchemaBackend;
                        topoConfiguration.istopnode = false;
                        topoConfiguration.changeToolBar(false,nodetype);                  
                        topoConfiguration.changeTreeNode();
                    	$('#overlay').hide();
                    	$('#overlay').css('opacity','0.8');
                     	$('#delLoading').hide();
                	}
                }
            });
        }else{
        	topoConfiguration.changeToolBar(true,nodetype);                  //显示
        	topoConfiguration.istopnode = true;
        	topoConfiguration.clearTopoData();
        	$('#overlay').hide();
        	$('#overlay').css('opacity','0.8');
        	$('#delLoading').hide();
        }
    }

    var loadAuths = function(){
        $.omcAjax('/staff/auth', {}, function(res){
           if(res.success) {
               var data = res.data;
               for(var i = 0; i < data.length; i++) {
                   if(data[i].id === 'ztmenu'){
                       var auths = data[i].children;
                       if(auths) {
                           for(var j = 0; j < auths.length; j++) {
                               $('#' + auths[j].id).show();
                           }
                       }
                   }
               }
           }
        });


    };
//    loadAuths();
    var myselectNode = true;
    $('#treeCtrl').find('a').on('click', function () {
        var selectedNodes = topoTree.getSelectedNodes();
        var ctrlId = $(this).parent().attr('id');
        if ('ztAddFolder' !== ctrlId && selectedNodes.length != 1) {
            App.myMsg(Msg.ztpz.selectANodeFirst);
            return false;
        }
        var selectedNode = selectedNodes[0];
        var NODE_TPL = 'tpl';
        var NODE_UTPL = 'utpl';
       // var NODE = 'node';
        switch (ctrlId) {
            case 'ztAddNode':
                if(selectedNode.type === NODE_TPL){
                	App.myMsg(Msg.ztpz.err.cantNewTpl);//不能新建模板节点
                    return false;
                }else if (selectedNode.type === NODE_UTPL ) {
                	addNodeUtpl(selectedNode);
				}else {
					addNode(selectedNode);
				}
                break;
            case 'ztAddFolder':
                checkIsExistStation(selectedNode);
                //addFolder(selectedNode);
                break;
            case 'ztUpdateNode':
                if(selectedNode.type === NODE_TPL){
                	App.myMsg(Msg.ztpz.err.cantAlterTpl);//不能更新模板节点
                    return false;
                }else{
                	renameNode(selectedNode);
                }
                break;
            case 'ztRemoveNode':
                if(selectedNode.type === NODE_TPL){
                    App.myMsg(Msg.ztpz.err.cantRemoveTpl);//不能删除模板节点
                    return false;
                }else if (selectedNode.type === NODE_UTPL){
                	 App.myMsg(Msg.ztpz.err.cantRemoveUtpl);//不能删除自定义模板
                	 return false;
                }
                removeNode(selectedNode);
                break;
            default :
                App.myMsg(Msg.ztpz.notSupportFunction);
        }
    });

    function checkIsExistStation(selectedNode){
        $.omcHttp.GET('/cm/topoNodes/isExistStation', function(res){
            if(res.data){
                // exist
                App.myMsg(Msg.ztpz.err.stationExist);
                return false;
            } else {
                addFolder(selectedNode);
            }
        })
    }
    
    
    function removeNode(selectedNode) {
        if(selectedNode.parentId === 0){
            App.myMsg(Msg.ztpz.err.cantRemoveStationNode);//不能删除电站节点
            return false;
        }
    	if(selectedNode.isParent){
            App.myMsg(Msg.ztpz.removeChildredFirst);//请先删除该节点下的子节点
    		return false;
    	} else {
            if(!topoConfiguration.isTopoDataEmpty()){
                App.myMsg(Msg.ztpz.emptyPelFirst);//请先清空组态图下的图元
                return false;
            }
            App.myConfirm(Msg.ztpz.confrimRemove+selectedNode.name+Msg.ztpz.trueOrFalse, function(){//	确认删除
                $.omcHttp.DELETE(url + '/' + selectedNode.id, function(res) {
                    if(res.success){
                        topoTree.removeNode(selectedNode);
                        App.myMsg(Msg.ztpz.removeSuccess);
                        //topoConfiguration.clearTopoData();
                        topoConfiguration.deleteTopoData();
                        topoConfiguration.changeToolBar(true,"node");                      //隐藏工具栿
                    } else {
                        App.myMsg(Msg.ztpz.err.hasRemoved);//该节点已被其它客户端用户删除
                        topoTree.removeNode(selectedNode);
                        //refreshNodeTree()
                    }
                })
            }, function(){
                return false;
            })
    	}
    }

    function isPositiveInt(val){
        var positiveRegStr = '^[1-9]\\d{0,4}$';
        var positiveReg = new RegExp(positiveRegStr);
        return positiveReg.test(val);
    }
    
    function addNodeUtpl(selectedNode) {
        $.omcHttp.GET('/cm/topoNodes/conf/' + selectedNode.id, function (res) {
            	var str = '<div id="modelDialogAdd"><label for="topoNameAdd">'+Msg.ztpz.nameNod+':&nbsp;&nbsp;</label><input id="topoNameAdd" class="input-dialog input-width" maxlength="'+strLengthLimit+'"/><span class="must-star">*</span></div>';
            	
                $.omcDialog(Msg.ztpz.buildNewNormal, str, function(){
                   var inputName = $('#topoNameAdd').val();
                   if ($.trim(inputName) === '') {
                       App.myMsg(Msg.ztpz.invalidName); 
                       return false;
                   }
                   var newNode = {topoNode: {'name': inputName, 'parentId': selectedNode.id,'sequence':""},
                           schemeTypeId: "11",
                           standardCode: "1",
                           busiObjectId: ""
                       };
                 	newNode.invType =  $('#inverterType').find('option:selected').val();
                 	
                 	 var inputtopoName = $('#topoNameAdd').val();
                     if ($.trim(inputtopoName) === '') {
                         App.myMsg(Msg.ztpz.invalidNodeName);
                         return false;
                     }

                     if(!filterChars(inputtopoName)){
                         App.myMsg(Msg.ztpz.nodeName + dangerCharsAlert);
                         return false;
                     }
                     if(App.checkEmpty(inputtopoName)){
                    	 App.myMsg(Msg.ztpz.notTwoEmpt);
                         return false;
                    }
                     if(inputtopoName.length > strLengthLimit){
                         App.myMsg(Msg.ztpz.tooManyWords + ',' + strLengthLimit + Msg.ztpz.charCount);
                         return false;
                     }
                   $.omcHttp.POST(url, newNode, function (res) {
                       if (res.success) {
                           App.myMsg(Msg.ztpz.saveSuccess);
                           topoTree.addNodes(selectedNode, res.data.topoNode);
                       } else {
                           if(res.data == "repeateassociated"){
                               App.myMsg(Msg.ztpz.devverberelated);            //
                           }else if(res.data == "exist"){
                           	App.myMsg(Msg.ztpz.nameexist); //节点名称已存在
                        	return false;
                           }else if(res.data == "sameAreaNumber"){
           					App.myMsg(Msg.ztpz.areanumexist); //分区编号已存在
        					return false;
        				   }else{
                               App.myMsg(eval(res.data));
                           }
                       }
                       $('#modelDialogAdd').remove();
                   });
                });
        });
      }
    
    function addNode(selectedNode) {
    	
    	if(selectedNode.iconSkin === "tpl"){
    		App.myMsg(Msg.ztpz.cantContinueBuildNode);
            return false;
    	}
        $.omcHttp.GET('/cm/topoNodes/confSchemeTypeInfos/' + selectedNode.id, function (res) {
            if (res.success) {
                var selectionData = res.data.data;
                var runMode = parent.Cookies.get('ComcMode');
      		    if(!runMode || runMode!='COMC'){
      		    	$.each(selectionData,function(t,e){
                  	  if(e.id == 14){
                  		selectionData.splice(t,1);
                  	  }
                  });
      		    }
                var uuid = res.data.uuid;
                if( selectionData.length === 0) {
                     App.myMsg(Msg.ztpz.cantContinueBuildNode);
                     return false;
                 }
                var slectionType = '<select id="confSchemeTypeInfoAdd" class="input-dialog input-width">';
                for (var i in selectionData) {
                    slectionType += '<option value="' + selectionData[i].id + '">' + selectionData[i].name + '</option>';
                }
                slectionType += '</select>';
                var dialogContent = '<div id="popDialogAdd"><div id="confSchemeTypeInfoAddDiv"><label for="confSchemeTypeInfoAdd">'+Msg.ztpz.topoType+':&nbsp;&nbsp;</label>' + slectionType + '<span class="must-star">*</span></div><br/><div><label for="topoNameAdd">'+Msg.ztpz.nodeName+':&nbsp;&nbsp;</label><input id="topoNameAdd" class="input-dialog input-width" maxlength="'+strLengthLimit+'"/><span class="must-star">*</span></div><br/><div id="modverdiv" style="display:none"><label >'+Msg.ztpz.versionType+':&nbsp;&nbsp;</label><select id="modevid" class="input-dialog input-width"/></select></div><input type="hidden" id="modevbr"/><div id="standardCodeDivAdd"><label for="standardCodeAdd">'+Msg.ztpz.standardCode+':&nbsp;&nbsp;</label><input id="standardCodeAdd" type="text" class="input-dialog input-width" maxlength="'+strLengthLimit+'"/></div><br/><div id="nodeSeqAddDiv"><label for="nodeSeqAdd">'+Msg.ztpz.seqNo+':&nbsp;&nbsp;</label><input id="nodeSeqAdd" type="text" class="input-dialog input-width" maxlength="5"/></div><br/>';
                dialogContent = dialogContent+' <div id="distributeSub" style="display:none;"><div id="areaNo" style="display:none;"><label>'+Msg.ztpz.areaNo+':&nbsp;&nbsp;</label><input id="areaNumber" type="text" class="input-dialog input-width" maxlength="20" readOnly="true"/></div><br/>';
                dialogContent = dialogContent+'<div id="invType" style="display:none;margin-right:15px;"><label>'+Msg.ztpz.invType+':&nbsp;</label><select id="inverterType" class="input-dialog input-width"><option value="1">'+Msg.ztpz.group+'</option><option value="2">'+Msg.ztpz.collect+'</option><option value="3">'+Msg.ztpz.blend+'</option></select></div><br/></div>';
                dialogContent = dialogContent + '</div>';
                  if(selectionData.length == 0){
                      $('#confSchemeTypeInfoAddDiv').hide();
                  }

                var bindFn = function(){
                    $('#confSchemeTypeInfoAdd').on('change', function () {     
                    	$('#modevid').on('change', function () {                  
                        	$("#topoNameAdd").val($('#modevid').find("option:selected").text());          
                        });
                        var typeCode = $(this).children('option:checked').val();
                        if(typeCode){
                            typeCode = parseInt(typeCode);
                        }
                        if (typeCode === 4 || typeCode === 5 || typeCode === 9 || typeCode === 12 || typeCode === 13) {                //箱变分图或者逆变器分图(加上直流汇流箱)，增加PID
                            $('#standardCodeDivAdd').hide();
                            $('#modverdiv').show();                            //版本型号
                            $('#modevbr').show();
                            var nodetypeid = null;
                            if(typeCode === 4){                                
                            	nodetypeid = 13;                              //箱变
                            }
                            else if(typeCode === 5){
                            	nodetypeid = 5;                               //组串式逆变器
                            }
                            else if(typeCode === 12){                         //直流汇流箱
                            	nodetypeid = 45;
                            }
                            else if(typeCode === 13){//PID
                            	nodetypeid = 57;
                            }
                            else {
                            	nodetypeid = 42;                               //集中式逆变器
                            }
                            var objInfo = {pelTypeID: nodetypeid};
            				$.omcAjax("/cm/dev/devtypes", objInfo, function (data) {             //获取版本
                                if (data.success == false){
                                	     $("#alertmsg").html("");
                                	     $("#alertmsg").html(Msg.topocfg.getverlistfail);     //获取版本列表失败
            				             $("#alertdlg").dialog("open");
            		     				 return false;
            		     			 }
            		     			 if(data.success == true){
            		     				$("#modevid").html("");
            		     		  		 var size = data.data.length;
            		     		  		 if(size == 0){
            		     		  			 App.myMsg(Msg.ztpz.withoutDevVer + ',' + Msg.ztpz.importDotTableFirst);                
                                             $('#popDialogAdd').dialog('destroy');
            		     		  			 return false;
            		     		  		 }
            		     		  		 else{
                                             var dataOptions = data.data;
            		     		  			 $("#modevid").html("");
                                             $('#topoNameAdd').val(dataOptions[0].modelVersionCode + Msg.ztpz.versions);
            		     		  			 for(var i = 0;i < size ;i++){
            		     		  				 var nameOption  = dataOptions[i].modelVersionCode;
            		     		  				 var idOption = dataOptions[i].id;

            		     		  			    // $("#modevid").append("<option value='"+idOption+"' name='"+name+"' >"+nameOption+"ѦѾ</option");

            		     		  			     $("#modevid").append("<option value='"+idOption+"' name='"+name+"' >"+nameOption + Msg.ztpz.versions+"</option");

            		     		  			 }
            		     		  		 }	
            		     			 }
            		     	},false);
                        } else {
                            $('#standardCodeDivAdd').show();
                            $('#modverdiv').hide();                            
                            $('#modevbr').hide();
                            $("#topoNameAdd").val('');
                        }
                        
                        if ( stationType==2 && typeCode == 2) {
                        	$('#areaNo').show();                            
                            $('#invType').show();
                        	$('#distributeSub').show();
                        	$('#areaNumber').val(uuid);
                        	$('#areaNumber').attr('title',uuid);
                        }else{
                        	$('#areaNo').hide();                            
                            $('#invType').hide();
                        	$('#distributeSub').hide();
                        }
                    });
                };
                $.omcDialog(Msg.ztpz.buildNewNormalNode, dialogContent, function(){
                    var inputtopoName = $('#topoNameAdd').val();
                    //                            if (!/^[a-z0-9_-]{3,16}$/.test(inputtopoName)) {
                    if ($.trim(inputtopoName) === '') {
                        App.myMsg(Msg.ztpz.invalidNodeName);
                        return false;
                    }

                    if(!filterChars(inputtopoName)){
                        App.myMsg(Msg.ztpz.nodeName + dangerCharsAlert);
                        return false;
                    }
                    if(App.checkEmpty(inputtopoName)){
                    	 App.myMsg(Msg.ztpz.notTwoEmpt);
                         return false;
                    }
                    
                    if(inputtopoName.length > strLengthLimit){
                        App.myMsg(Msg.ztpz.tooManyWords + ',' + strLengthLimit + Msg.ztpz.charCount);
                        return false;
                    }
                    var selectTypeId = $('#confSchemeTypeInfoAdd').find('option:selected').val();
                    if (selectTypeId == '') {
                        App.myMsg(Msg.ztpz.invalidtopoType);
                        return false;
                    }

                    var standardCode = $('#standardCodeAdd').val();
                    if (selectTypeId != 4 && selectTypeId != 5 && selectTypeId != 9) {
                        // 屏蔽标准代码 #1
                        /*if (standardCode == '') {
                            App.myMsg(Msg.ztpz.invalidstandardCode);
                            return false;
                        }*/
                        if(!filterChars(standardCode)){
                            App.myMsg(Msg.ztpz.invalidstandardCode + dangerCharsAlert);
                            return false;
                        }
                        if(standardCode.length > strLengthLimit){
                            App.myMsg(Msg.ztpz.tooManyWords);
                            return false;
                        }
                    }

                    var busiObjectIdTmp = $('#modevid').val();                 //箱变分图，逆变器分图版本ID
                    if((busiObjectIdTmp == null) || (busiObjectIdTmp == "") || (busiObjectIdTmp == undefined)){
                        busiObjectIdTmp = "";
                    }
                    if (selectTypeId == 4 || selectTypeId == 5 || selectTypeId == 9) {
                        if(busiObjectIdTmp == ""){
                            App.myMsg(Msg.ztpz.plechodevver);                 //请选择版本类型
                            return false;
                        }
                    }

                    var seqNo = $('#nodeSeqAdd').val();
                    if($.trim(seqNo) !== '' && !isPositiveInt(seqNo)){
                        App.myMsg(Msg.ztpz.err.invalidSeqNo);
                        return false;
                    }
                    
                    var newNode = {topoNode: {'name': inputtopoName, 'parentId': selectedNode.id, 'sequence':seqNo},
                        schemeTypeId: selectTypeId,
                        standardCode: standardCode,
                        busiObjectId: busiObjectIdTmp
                    };

                    if (stationType == 2 && selectTypeId === '2') {
                    	var areaNo = $('#areaNumber').val();
                    	if($.trim(areaNo) === ''){
                            App.myMsg(Msg.ztpz.err.areaNoNotBeNull);
                    		return false;
                    	}
                    	newNode.areaNo = areaNo;
                    	newNode.invType =  $('#inverterType').find('option:selected').val();
                    }
                    $.omcHttp.POST(url, newNode, function (res) {
                        if (res.success) {
                            App.myMsg(Msg.ztpz.saveSuccess);
                            topoTree.addNodes(selectedNode, res.data.topoNode);
                            refSelectNode = {};
                            refSelectNode.name = selectedNode.name;
                            refSelectNode.sequence = selectedNode.sequence;
                            refSelectNode.parentId = selectedNode.parentId;
                            refSelectNode.id = selectedNode.id;
                            refSelectNode.open = myselectNode;
                            refreshNodeTree();
                        } else {
                            if(res.data == "repeateassociated"){
                                App.myMsg(Msg.ztpz.devverberelated);            //选择版本型号已经关联
                            }else if(res.data == "exist"){
                            	App.myMsg(Msg.ztpz.nameexist); //节点名称已存在
                            	return false;
                            }else if(res.data == "sameAreaNumber"){
            					App.myMsg(Msg.ztpz.areanumexist); //分区编号已存在
            					return false;
            				}
                            else{
                                App.myMsg(eval(res.data));
                            }
                        }
                        $('#popDialogAdd').remove();
                    });
                    
                }, bindFn);
            }
        });
    }

    function addFolder(selectedNode) {
        var dialogContent = '<div id="popDialogAddFolder"><label for="topoNameAddFolder">'+Msg.ztpz.nodeName+':&nbsp;&nbsp;</label><input id="topoNameAddFolder" class="input-dialog input-width" maxlength="'+strLengthLimit+'"/><span class="must-star">*</span></div>';
        $.omcDialog(Msg.ztpz.buildNewStationNode, dialogContent, function(){
            var inputtopoName = $('#topoNameAddFolder').val();
            // if (!/^[a-z0-9_-]{3,16}$/.test(inputtopoName)) {
            if ($.trim(inputtopoName) == '') {
                App.myMsg(Msg.ztpz.invalidNodeName);
                return false;
            }
            if(inputtopoName.length > 64){
                App.myMsg(Msg.ztpz.tooManyWords + ',' + strLengthLimit + Msg.ztpz.charCount);
                return false;
            }
            var newFolder = {
                "topoNode": {"name": inputtopoName, "parentId": 0},
                "schemeTypeId": "",
                "standardCode": ""
            };
            $.omcHttp.POST(url+'/addFolder', newFolder, function (res) {
                if (res.success) {
                    App.myMsg(Msg.ztpz.saveSuccess);
                    topoTree.addNodes(null, res.data);
                    var nodes = topoTree.getNodes();
                    topoTree.moveNode(nodes[0], nodes[1], "prev");
                    $('#popDialogAddFolder').remove();
                }
            });
        });
        /*App.myDialog(Msg.ztpz.buildNewStationNode, dialogContent, function(){

        }, function(){
            return false;
        });*/
    }
    function renameNode(selectNode) {
        var isFirstLevelNode = selectNode.parentId === 0;
        var isFirstLevel = selectNode.type === "utpl";
        if (selectNode.parentId === 0 && selectNode.type === "utpl") {
        	App.myMsg(Msg.ztpz.warn.correctWithOtherPage);
        }else if(selectNode.parentId === 0 || selectNode.type === "utpl"){
        	var runMode = parent.Cookies.get('ComcMode');
        	if(runMode && runMode=='COMC'){
        		App.myMsg(Msg.ztpz.warn.correctNotAlter);//电站集控系统名称不能修改
        	}else{
        		App.myMsg(Msg.ztpz.warn.correctStationNameWithOtherPage);////请到电站信息设置页面修改
        	}
        }
        else {
            $.omcHttp.GET(url + '/' + selectNode.id, function (res) {
                var data = res.data;
                var topoNode = data.topoNode;
                $.omcHttp.GET('/cm/topoNodes/confSchemeTypeInfos/' + selectNode.id, function (res) {
                    if (res.success) {
                        var selectionData = res.data.data;

                        if (selectionData.length === 0 || selectNode.parentId === 7) {
                        	var dialogContent = '<div id="popDialogRenameNode"><div><label for="topoNameRenameNode">'+Msg.ztpz.nodeName+':&nbsp;&nbsp;</label><input id="topoNameRenameNode" class="input-dialog input-width" maxlength="'+strLengthLimit+'" value="' + topoNode.name + '"/><span class="must-star">*</span></div><br/><div id="standardCodeDivRenameNode"><label for="standardCodeRenameNode">'+Msg.ztpz.standardCode+':&nbsp;&nbsp;</label><input id="standardCodeRenameNode" type="text" class="input-dialog input-width" maxlength="'+strLengthLimit+'" value="' + data.standardCode + '"/></div><br/><div id="nodeSeqUpdateDiv"><label for="nodeSeqUpdate">'+Msg.ztpz.seqNo+':&nbsp;&nbsp;</label><input id="nodeSeqUpdate" type="text" class="input-dialog input-width" maxlength="5" value="'+topoNode.sequence+'"/><span class="must-star">*</span></div><br/><div>'+Msg.ztpz.topoType+':&nbsp;&nbsp;<input type="text" class="input-fade input-width" readonly value="'+data.schemeTypeName+'"/></div><br/>';
                        	if (data.schemeTypeId === 4 || data.schemeTypeId === 5 || data.schemeTypeId === 9 || data.schemeTypeId === 12 || data.schemeTypeId === 13) {
                        		//$('#standardCodeDivRenameNode').hide();
                        		dialogContent = '<div id="popDialogRenameNode"><div><label for="topoNameRenameNode">'+Msg.ztpz.nodeName+':&nbsp;&nbsp;</label><input id="topoNameRenameNode" class="input-dialog input-width" maxlength="'+strLengthLimit+'" value="' + topoNode.name + '"/><span class="must-star">*</span></div><br/><div id="nodeSeqUpdateDiv"><label for="nodeSeqUpdate">'+Msg.ztpz.seqNo+':&nbsp;&nbsp;</label><input id="nodeSeqUpdate" type="text" class="input-dialog input-width" maxlength="5" value="'+topoNode.sequence+'"/><span class="must-star">*</span></div><br/><div>'+Msg.ztpz.topoType+':&nbsp;&nbsp;<input type="text" class="input-fade input-width" readonly value="'+data.schemeTypeName+'"/></div><br/><div>'+Msg.ztpz.versionType+':&nbsp;&nbsp;<input type="text" class="input-fade input-width" readonly value="'+data.versionName+'"/></div><br/></div>';
                        	}
                        	if(stationType == 2 && data.schemeTypeId === 2){
                        		var select1 = data.invType== 1 ? "selected='selected'":"";
                        		var select2 = data.invType== 2 ? "selected='selected'":"";
                        		var select3 = data.invType== 3 ? "selected='selected'":"";
                        		dialogContent = dialogContent+'<div id="areaNo" ><label>'+Msg.ztpz.areaNo+':&nbsp;&nbsp;</label><input id="areaNumber" type="text" class="input-dialog input-width" value="' + data.areaNo + '" title="' + data.areaNo + '" maxlength="20" readOnly="true"/></div><br/>';
                        		dialogContent = dialogContent+'<div id="invType" style="margin-right:15px;"><label>'+Msg.ztpz.invType+':&nbsp;</label><select id="inverterType" class="input-dialog input-width"><option value="1" '+select1+'>'+Msg.ztpz.group+'</option><option value="2" '+select2+'>'+Msg.ztpz.collect+'</option><option value="3" '+select3+'>'+Msg.ztpz.blend+'</option></select></div><br/>';
                        	}
                        	dialogContent =  dialogContent +'</div>';
                        	$.omcDialog(Msg.ztpz.updateNode, dialogContent,function(){
                        		var inputtopoName = $('#topoNameRenameNode').val();
                        		if ($.trim(inputtopoName) === '') {
                        			App.myMsg(Msg.ztpz.invalidNodeName);//节点名称不能为空
                        			return false;
                        		}
                        		
                        		if(!filterChars(inputtopoName)){
                        			App.myMsg(Msg.ztpz.nodeName + dangerCharsAlert);
                        			return false;
                        		}
                        		
                        	    if(App.checkEmpty(inputtopoName)){
                                 	 App.myMsg(Msg.ztpz.notTwoEmpt);
                                      return false;
                                }
                        	    
                        		if(inputtopoName.length > strLengthLimit){
                        			App.myMsg(Msg.ztpz.tooManyWords + ',' + strLengthLimit + Msg.ztpz.charCount);
                        			return false;
                        		}
                        		var standardCode = '';
                        		if(data.schemeTypeId !== 4 && data.schemeTypeId !== 5 && data.schemeTypeId !== 9 && data.schemeTypeId !== 12 && data.schemeTypeId !== 13){
                        			standardCode = $('#standardCodeRenameNode').val();
                        			if(!filterChars(standardCode)){
                        				App.myMsg(Msg.ztpz.invalidstandardCode + dangerCharsAlert);
                        				return false;
                        			}
                        			if(standardCode.length > strLengthLimit){
                        				App.myMsg(Msg.ztpz.tooManyWords);
                        				return false;
                        			}
                        		}
                        		var seqNo = $('#nodeSeqUpdate').val();
                        		if($.trim(seqNo) === ''){
                        			App.myMsg(Msg.ztpz.err.seqNoNotBeNull);
                        			return false;
                        		}
                        		if(!isPositiveInt(seqNo)){
                        			App.myMsg(Msg.ztpz.err.invalidSeqNo);
                        			return false;
                        		}
                        		
                        		var updateNode = {"topoNode": {"id": selectNode.id, "name": inputtopoName, "sequence": seqNo, "parentId": selectNode.parentId},
                        				"schemeTypeId": data.schemeTypeId,
                        				"standardCode": standardCode
                        		};
                        		                     		
                        		 if (stationType == 2 && data.schemeTypeId === 2) {
                                 	var areaNo = $('#areaNumber').val();
                                 	if($.trim(areaNo) === ''){
                                         App.myMsg(Msg.ztpz.err.areaNoNotBeNull);
                                 		return false;
                                 	}
                                 	updateNode.areaNo = areaNo;
                                 	updateNode.invType =  $('#inverterType').find('option:selected').val();
                                 }
                        		$.omcHttp.PUT(url, updateNode, function (res) {
                        			if (res.success) {
                        				$('#popDialogRenameNode').remove();
                        				App.myMsg(Msg.ztpz.updateSuccess);
                        				var resNode = res.data;
                        				selectNode.name = resNode.name;
                        				selectNode.sequence = resNode.sequence;
                        				selectNode.parentId = resNode.parentId;
                        				topoTree.updateNode(selectNode);
                        				refSelectNode = selectNode;
                        				refreshNodeTree();
                        			}else{
                        				if(res.data == "exist"){
                        					App.myMsg(Msg.ztpz.nameexist); //节点名称已存在
                        					return false;
                        				}else if(res.data == "sameAreaNumber"){
                        					App.myMsg(Msg.ztpz.areanumexist); //分区编号已存在
                        					return false;
                        				}else if(res.data == "removed"){
                        					App.myMsg(Msg.ztpz.err.hasRemoved);//该节点已被其它客户端用户删除
                        					$('#popDialogRenameNode').remove();
                        				}
                        			}
                        		});
                        	});
                        }else if(selectionData.length === 1){
                        	
							var str = '<div id="modelDialogUpdate"><label for="topoNameRenameNode">'+Msg.ztpz.nameNod+':&nbsp;&nbsp;</label><input id="topoNameRenameNode" class="input-dialog input-width" maxlength="'+strLengthLimit+'" value="' + topoNode.name + '"/><span class="must-star">*</span></div>';
			                    $.omcDialog(Msg.ztpz.updateNode, str, function(){
			                        var inputName = $('#topoNameRenameNode').val();
			                        var inputtopoName = $('#topoNameRenameNode').val();
			                        if ($.trim(inputName) === '') {
			                            App.myMsg(Msg.ztpz.invalidNodeName);//节点名称不能为空
			                            return false;
			                        }

			                      
			                        if(inputName.length > strLengthLimit){
			                            App.myMsg(Msg.ztpz.tooManyWords + ',' + strLengthLimit + Msg.ztpz.charCount);
			                            return false;
			                        }

			                        if(!filterChars(inputtopoName)){
	                        			App.myMsg(Msg.ztpz.nodeName + dangerCharsAlert);
	                        			return false;
	                        		}
			                        if(App.checkEmpty(inputtopoName)){
			                       	 	App.myMsg(Msg.ztpz.notTwoEmpt);
			                            return false;
			                       }
			                        var updateNode = {"topoNode": {"id": selectNode.id, "name": inputName, "sequence": "1", "parentId": selectNode.parentId},
			                            "schemeTypeId": "11",
			                            "standardCode": ""
			                        };

			                        $.omcHttp.PUT(url, updateNode, function (res) {
			                            if (res.success) {
			                            	$('#popDialogRenameNode').remove();
			                                App.myMsg(Msg.ztpz.updateSuccess);
			                                var resNode = res.data;
			                                selectNode.name = resNode.name;
			                                selectNode.sequence = resNode.sequence;
			                                selectNode.parentId = resNode.parentId;
			                                topoTree.updateNode(selectNode);
			                                refSelectNode = selectNode;
			                                refreshNodeTree();
			                            }else{
	                        				if(res.data == "exist"){
	                        					App.myMsg(Msg.ztpz.nameexist); //节点名称已存在
	                        					return false;
	                        				}else if(res.data == "sameAreaNumber"){
	                        					App.myMsg(Msg.ztpz.areanumexist); //分区编号已存在
	                        					return false;
	                        				}else if(res.data == "removed"){
	                        					App.myMsg(Msg.ztpz.err.hasRemoved);//该节点已被其它客户端用户删除
	                        					$('#modelDialogUpdate').remove();
	                        				}
	                        			}
			                            $('#modelDialogUpdate').remove();
			                        });
			                    });
                            }
                       }
                });

            })
        }
    }
});


/**
 * 切换点表操作
 */
function changeModelVersion(){
	
	var modelversionid = $("#modelVersionID").val();
	var bussinessCode = $("#bussinessCode").val();
	if(modelversionid == null || modelversionid == ""){
		$("#devicePort").val("");
	}
	$('#devicePort').attr("readonly",false);
	var DevConmmonInfo = {};
	 DevConmmonInfo.modelVersionID = modelversionid;
	 DevConmmonInfo.bussinessCode = bussinessCode;
	 DevConmmonInfo.token = "";
	 $.omcAjax("/cm/dev/getVersionInfo", DevConmmonInfo, function(data) {
		 if(data.success == false){
			 topo.Util.failTip(data,Msg.topocfg.dataModelDeleted);  	//  获取点表信息失败
			 return false;
		 }
		 if(data.success == true && data != null && data.data!=null&& data.data.dev !=null){
			var portNumber = data.data.dev.port;
			if(portNumber != "" || portNumber !=null){
				$("#devicePort").val(portNumber);	
				return;
			}
		 }
		 if(data.success == true && data != null&&data.data.modelInfo!=null){
			var protocolCode = data.data.modelInfo.protocolCode;
			 var devicePortVal = $('#devicePort').val();
			 if("HWMODBUS" == protocolCode ){
				 $('#devicePort').attr("readonly",true);
					 $("#devicePort").val("7077");
			 }else if("104" == protocolCode ){
				 if(devicePortVal == null || devicePortVal == "" || devicePortVal == "7077" || devicePortVal == "2424"){
					 $("#devicePort").val("2404");
				 }
			 }else if("103" == protocolCode || "103-1" == protocolCode){
				 if(devicePortVal == null || devicePortVal == "" || devicePortVal == "7077" || devicePortVal == "2404"){
					 $("#devicePort").val("2424");		 
				 }
			 }
		 }
	});
}