//请求数据
var _ajaxRequest,indexPage;
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
				pageHtml+='共<span class="totalNum">'+data.num+'</span>条记录<span class="currentPage">'+currentPage+'</span>/<span class="totalPage">'+allPage+'</span>页  <a href="javascript:void(0)" class="first">首页</a>  <a href="javascript:void(0)" class="prev">上一页</a> ';
				indexPage = getPageList(currentPage,allPage,5);
				for(var j=0,len = indexPage.length;j<len;j++){
					pageHtml+='<a href="javascript:void(0)" class="pageOne" data-page="'+indexPage[j]+'">'+indexPage[j]+'</a>';
				}
				pageHtml+=' <a href="javascript:void(0)" class="next">下一页</a>  <a href="javascript:void(0)" class="last">尾页</a>   第';
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
				$('.list-content .page-box .pageOne').removeClass('active');
				$('.list-content .page-box .pageOne').eq(page-indexPage[0]).addClass('active');
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

//跳到某一页
var goToPage = function(){
	$('.list-content').on('click','.page-box a.pageOne',function(){
		currentPage = parseInt($(this).attr('data-page'));
		requireData(currentIndex,currentPage);
	})
}

//配置页数列表
function getPageList(currentPage,totalPage,maxPage){
	var pageList = new Array();
	if(totalPage<=maxPage){
		//页数列表总页数小于1的情况
		for(var i = 0;i < totalPage; i++){
			pageList[i] = i+1;
		}
	}else{
		//页数列表总页数大于1的情况
		//页数列表最后一页
		if(currentPage+maxPage > totalPage){
			indexPage = totalPage - maxPage + 1;
			if(currentPage <= totalPage - maxPage/2){
				//页数列表最后一页前半部分
				for(var j=0;j<maxPage;j++){
					pageList[j] = currentPage + j - Math.floor(maxPage/2);
				}
			}else{
				//页数列表最后一页后半部分
				for(var j=0;j<=maxPage-1;j++){
					pageList[j] = indexPage;
					indexPage++;
				}
			}
		}else{
			//页数列表第一页和最后一页之间
			if(currentPage >= maxPage - 1){
				for(var j=0;j<maxPage;j++){
					pageList[j] = currentPage + j - Math.floor(maxPage/2);
				}
			}else{
				//页数列表第一页
				if(currentPage <= maxPage/2){
					//页数列表最后一页前半部分
					for(var j=0;j<maxPage;j++){
						pageList[j] = j+1;
					}
				}else{
					//页数列表最后一页后半部分
					for(var j=0;j<maxPage;j++){
						pageList[j] = currentPage + j - Math.floor(maxPage/2);
					}
				}
			}
		}
	}
	return pageList;
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
goToPage();
next();//下一页
last();//尾页