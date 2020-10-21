importClass(android.view.View);

const width = device.width;
const height = device.height;

auto.waitFor();
registEvent();

//模拟手势向下滑动
function gest_down(){
    gestures([0, 500, [800, 1000], [500, 300]],
        [0, 500, [300, 2000], [500, 900]]);
}
//模拟手势向上滑动
function gest_up(){
    gestures([0, 500, [800, 300], [500, 1000]],
        [0, 500, [300, 900], [500, 200]]);
}

/**
 * 设置按键监听 当脚本执行时候按音量减 退出脚本
 */
function registEvent() {
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("KEYCODE_VOLUME_DOWN", function (event) {
        toastLog("脚本手动退出");
        exit();
    });
}

//任务执行状态
function job_status(oneJob){
    let btn = oneJob.parent().parent().findOne(className("android.widget.Button"));
    if(!btn){
        return false;
    }
    return btn.text() ==="已完成";
}

//执行具体的任务 ,返回true的时候表示 需要进入下一个迭代
// tag1: 浏览15秒得75星星 浏览15秒得50星星
function doingJob(jobTag){
    let oneJob ;
    let isEnd;
    let list = textContains(jobTag).find();
    if(!list.empty()){
        console.log("当前任务:["+jobTag+"] 任务列表有任务")
        let isRuned = false;
        list.forEach(function(uiObject){
                let oneJob = text(uiObject.text()).findOne();
                isEnd = job_status(oneJob)
                console.log("执行子任务:"+uiObject.text()+" 子任务状态:"+isEnd);
                if(!isEnd){
                        isRuned =true;
                        //判断是不是有任务做 
                        // oneJob.bounds()
                        if(oneJob){
                            toast("准备执行:"+jobTag);
                            // press(oneJob.bounds().centerX(),oneJob.bounds().centerY(),3)
                            oneJob.click();
                            //进入活动页面需要时间.一般5-7秒能打开
                            sleep(7000);

                            if(!text("领取亲密度").exists()){
                                console.log("模拟向下滑动");
                                gest_down(); //向下滑动一下
                            }
                            sleep(10*1000);
                            if(!text("领取亲密度").exists()){
                                console.log("模拟向下滑动");
                                gest_down(); //向下滑动一下 
                            } 
                            sleep(10*1000);
                            if(!text("领取亲密度").exists()){
                                console.log("模拟向上滑动");
                                gest_up();
                            }
                            sleep(1*1000); 
                            back();
                            sleep(1*1000); 
                        }
                }
                sleep(3*1000); 
            });

        if(isRuned){
            return true;
        }
    }
    return false;
}

var x = 0,
    y = 0,
    windowX = 0,
    windowY = 0,
    isRuning = false,
    showConsole = false,
    isShowingAll = true;

threads.start(function () {

    var window = floaty.window(
	    <vertical>
	        <button id="start"   margin="0" w="60">开始</button>
	        <button id="stop"    margin="0" w="60" visibility="gone">停止</button>
	        <button id="console" margin="0" w="60">调试</button>
            <button id="exit"    margin="0" w="60">退出</button>
	    </vertical>
    );
    
    window.setPosition(window.getX(), window.getY() + 200);

   
        
    window.start.click(function () {
	    isRuning = true;
	    ui.run(function () {
	        window.start.setVisibility(View.GONE);
	        window.stop.setVisibility(View.VISIBLE);
        });
        
	});

    function stopAuto () {
	    isRuning = false;
	    ui.run(function () {
	        window.start.setVisibility(View.VISIBLE);
	        window.stop.setVisibility(View.GONE);
	    });
	    threads.shutDownAll();
	}
    window.stop.click(stopAuto);


    window.console.click(function () {
	    threads.start(function () {
	        if (showConsole == false) {
	            showConsole = true;
	            console.show();
	        } else {
	            showConsole = false;
                console.hide();
                console.clear();
	        }
	    });
    });
    
    window.exit.click(function () {
	    exit();
	});
});


 
    while(true){
        if(!isRuning){
            continue;
        }
        sleep(5000); //休息2秒判断


        if(className("android.widget.Button").text("领取奖励").exists()){
            console.log("找到 领取奖励");
            toast("找到 领取奖励");
            className("android.widget.Button").text("领取奖励").findOne().click();
            continue;
        }
        
        if(doingJob("浏览15秒最高可得")){
            continue;
        }
    
        if(doingJob("成功签到最高可得")){
            continue;
        }
        
        if(doingJob("最高可得")){
            continue;
        }
     
        if(doingJob("逛一逛")){
            continue;
        }
        if(doingJob("浏览")){
            continue;
        }
    
        if(className("android.widget.Button").text("赚喵币").exists()){
            console.log("找到 赚喵币");
            toast("找到 赚喵币");
            className("android.widget.Button").text("赚喵币").findOne().click();
            continue;
        }
    }
 