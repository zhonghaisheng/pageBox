//请求数据
var _ajaxRequest;
var requireData = function(index,page){
	currentIndex = index;
	currentPage = page;
	if(!_ajaxRequest){
		_ajaxRequest = $.ajax({
			type:'post',
			url:'./js/data2.json',
	        data:{'id':index,'page':page},
			dataType:'json',
			success:function(data){
				allPage = data.pagenum;
				if(data.state == 0){
					$('.list-content .content').html('<div class="tip-text">沒有更多數據了~</div>');
					if(page == 1){
						$('.list-content .page-box').hide();
					}
					return;
				}
				if(allPage <= 1){
					$('.list-content .page-box').hide();
				}else{
					$('.list-content .page-box').show();
				}
				var html = '<ul class="c-l">', content = data.data;
				for(var i=0,len = content.length;i<len;i++){
					html+='<li><span class="date fr">'+content[i].date+'</span><a href="detail.html" class="link fl">'+content[i].title+'</a></li>';
				}
				html+='<ul>';
				var pageHtml = '';
				pageHtml+='共<span class="totalNum">'+data.num+'</span>条记录<span class="currentPage">'+currentPage+'</span>/<span class="totalPage">'+allPage+'</span>页  <a href="javascript:void(0)" class="first">首页</a>  <a href="javascript:void(0)" class="prev">上一页</a>  <a href="javascript:void(0)" class="next">下一页</a>  <a href="javascript:void(0)" class="last">尾页</a>   第';
				pageHtml+='<input type="text" class="page">页';
				$('.list-content .page-box').html(pageHtml);
				$('.list-content .content').html(html);
				if(page == 1){
					$('.list-content .page-box .prev').hide();
				}else{
					$('.list-content .page-box .prev').show();
				}
				if(page == allPage){
					$('.list-content .page-box .next').hide();
				}else{
					$('.list-content .page-box .next').show();
				}
				$('.list-content .page-box .page').val(page);
				_ajaxRequest = null;
			},
			error:function(data){
				alert('请求数据失败');
				_ajaxRequest = null;
			}
		})
	}
}

//首页
var first = function(){
	$('.list-content').on('click','.page-box a.first',function(){
		currentPage = 1;
		requireData(currentIndex,currentPage);
	})
}

//上一页
var prev = function(){
	$('.list-content').on('click','.page-box a.prev',function(){
		currentPage--;
		requireData(currentIndex,currentPage);
	})
}

//下一页
var next = function(){
	$('.list-content').on('click','.page-box a.next',function(){
		currentPage++;
		requireData(currentIndex,currentPage);
	})
}

//尾页
var last = function(){
	$('.list-content').on('click','.page-box a.last',function(){
		currentPage = allPage;
		requireData(currentIndex,currentPage);
	})
}

//监听enter键
 $(document).keypress(function(e) {   
   if(e.which == 13) {  
   		var num = parseInt($('.list-content .page-box .page').val());
		if(isNaN(num)){
			alert('请输入页数~');
			return;
		}else{
			currentPage = num;
			requireData(currentIndex,currentPage);
		}
   }  
});

requireData(0,1);//默认请求第一页数据
first();//首页
prev();//上一页
next();//下一页
last();//尾页