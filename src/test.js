const cheerio = require('cheerio');
const $ = cheerio.load(`<div class="WB_feed_like" node-type="feed_content">
                        <div class="WB_feed_like" node-type="fl_screen_box">
    <div class="WB_feed_like"><a href="javascript:void(0);" action-type="fl_menu"><i class="W_ficon ficon_arrow_down S_ficon">c</i></a>
        <div class="WB_feed_like" style="display: none; position: absolute; z-index: 999;" node-type="fl_menu_right">
            <ul>
                                                                                <li><a action-type="thrid_rend_iframe" href="javascript:void(0)" suda-data action-data="width=660&height=556&mid=4127298820857543&src=%2F%2Fpromote.vip.weibo.com%2Fpromoteadvance%3Fdai_tou%3Dpc_profile_01%26touid%3D2297899503%26mid%3D4127298820857543&title=推广" title="帮上头条">帮上头条</a></li>
                                                                                                                                                                    <li>
                                <span class="hover">
                                                                                                                        <a href="javascript:void(0);" onclick="javascript:window.open('https://service.account.weibo.com/reportspam?rid=Fbsam3B5l&from=10106&type=1&url=%2Fthesecretapp&bottomnav=1&wvr=5', 'newwindow', 'height=700, width=550, toolbar =yes, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no');">投诉</a>
                                                                                                            </span>
                            </li>
                                                                        </ul>
        </div>
    </div>
</div>
        <div class="WB_feed_like">
            <div class="WB_feed_like"><a target="_blank" class="W_face_radius" suda-uatrack="key=noload_singlepage&value=user_pic" href="//weibo.com/thesecretapp?refer_flag=1005055013_" title="秘密123"><img usercard="id=2297899503&type=0&refer_flag=1005055013_" src="https://tva3.sinaimg.cn/crop.0.0.180.180.180/88f729efjw1e70ep9rr6oj2050050q33.jpg?KID=imgbed,tva&Expires=1579513749&ssig=Ll1KGQPE7N" width="50" height="50" alt="秘密123" class="W_face_radius"></a></div>
                    </div>

        <div class="WB_feed_like">
            <div class="WB_feed_like">
                <a href="//weibo.com/thesecretapp?refer_flag=1005055013_" target="_blank" class="W_f14 W_fb S_txt1" usercard="id=2297899503&type=0&refer_flag=1005055013_" suda-uatrack="key=noload_singlepage&value=user_name">秘密123</a>
                <a target="_blank" href="//fuwu.biz.weibo.com"><i title="微博官方认证" class="W_icon_co1 icon_approve_co"></i></a>                            </div>
            <div class="WB_feed_like">
                                <a name="4127298820857543" target="_blank" href="/2297899503/Fbsam3B5l?from=page_1006062297899503_profile&wvr=6&mod=weibotime" title="2017-07-08 18:03" date="1499508183000" class="S_txt2" node-type="feed_list_item_date" suda-data="key=tblog_home_new&value=feed_time:4127298820857543:fromprofile"> 2017-7-8 18:03</a> 来自 <a class="S_txt2" suda-uatrack="key=profile_feed&value=pubfrom_guest" action-type="app_source" target="_blank" href="https://app.weibo.com/t/feed/6vtZb0" rel="nofollow">微博 weibo.com</a>            \t            </div>

            <div class="WB_feed_like" node-type="follow_recommend_box" style="display:none"></div>

            <div class="WB_feed_like" node-type="feed_list_content" nick-name="秘密123">
                                                                                                                        聊天必备的神套路<img class="W_img_face" render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png" title="[笑cry]" alt="[笑cry]" type="face" style="visibility: hidden;"> ​​​​                                            </div>
                                                                <div class="WB_feed_like" style="display: none;" node-type="feed_list_media_disp"></div>
                                                                    <!-- 引用文件时，必须对midia_info赋值 -->
<!-- 微博心情，独立于标准的ul节点 -->
                    <div class="WB_feed_like" node-type="feed_list_media_prev">
        <div class="WB_feed_like">
            <!--判断图片的个数，渲染图片-->
                            <!--图片个数大于1，不渲染卡片-->
                <!--TODO 只显示图片-->
                
\t\t\t\t     <!--picture_count == 7-->
    <ul class="WB_media_a WB_media_a_mn WB_media_a_m7 clearfix" node-type="fl_pic_list" action-data="isPrivate=0&relation=0&clear_picSrc=%2F%2Fwx1.sinaimg.cn%2Fmw690%2F88f729efgy1fhcmksyzn0j20hr0q3jua.jpg,%2F%2Fwx3.sinaimg.cn%2Fmw690%2F88f729efgy1fhcmkxlx10j20hq0qy112.jpg,%2F%2Fwx4.sinaimg.cn%2Fmw690%2F88f729efgy1fhcmkzdf2aj20hf0qkwj6.jpg,%2F%2Fwx3.sinaimg.cn%2Fmw690%2F88f729efgy1fhcml1wpedj20hs0na77s.jpg,%2F%2Fwx1.sinaimg.cn%2Fmw690%2F88f729efgy1fhcml4y2f7j20hs0mzn32.jpg,%2F%2Fwx1.sinaimg.cn%2Fmw690%2F88f729efgy1fhcml80h9kj20hs0mtn0f.jpg,%2F%2Fwx4.sinaimg.cn%2Fmw690%2F88f729efgy1fhcmlc1789j20hs12b15c.jpg&thumb_picSrc=%2F%2Fwx1.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcmksyzn0j20hr0q3jua.jpg,%2F%2Fwx3.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcmkxlx10j20hq0qy112.jpg,%2F%2Fwx4.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcmkzdf2aj20hf0qkwj6.jpg,%2F%2Fwx3.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcml1wpedj20hs0na77s.jpg,%2F%2Fwx1.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcml4y2f7j20hs0mzn32.jpg,%2F%2Fwx1.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcml80h9kj20hs0mtn0f.jpg,%2F%2Fwx4.sinaimg.cn%2Fthumb150%2F88f729efgy1fhcmlc1789j20hs12b15c.jpg&uid=2297899503&pic_ids=88f729efgy1fhcmksyzn0j20hr0q3jua,88f729efgy1fhcmkxlx10j20hq0qy112,88f729efgy1fhcmkzdf2aj20hf0qkwj6,88f729efgy1fhcml1wpedj20hs0na77s,88f729efgy1fhcml4y2f7j20hs0mzn32,88f729efgy1fhcml80h9kj20hs0mtn0f,88f729efgy1fhcmlc1789j20hs12b15c&mid=4127298820857543&pic_objects=&object_ids=1042018%3Af7651283fec0d5ad54a9040f6c53af78%2C1042018%3Aa488ff5d9c108fe434ebaaf9bf5fbf51%2C1042018%3A324b611c3aeca79e095cd6385330ef1e%2C1042018%3A03983cd9401653f313a96dc5befca7f7%2C1042018%3A3b2e5c360b2500816cbc8da68a23ba5f%2C1042018%3A13bce0c97d462111f0b2e447be8f5b4c%2C1042018%3A9ff55141d0c4a9953fc71f3f5783748d&photo_tag_pids=">
                                                    <li class="WB_pic li_1 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcmksyzn0j20hr0q3jua" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcmksyzn0j20hr0q3jua:2297899503:0">
                               \t\t<img src="//wx1.sinaimg.cn/thumb150/88f729efgy1fhcmksyzn0j20hr0q3jua.jpg">
         \t\t                                    </li>
                                                    <li class="WB_pic li_2 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcmkxlx10j20hq0qy112" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcmkxlx10j20hq0qy112:2297899503:0">
                               \t\t<img src="//wx3.sinaimg.cn/thumb150/88f729efgy1fhcmkxlx10j20hq0qy112.jpg">
         \t\t                                    </li>
                                                    <li class="WB_pic li_3 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcmkzdf2aj20hf0qkwj6" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcmkzdf2aj20hf0qkwj6:2297899503:0">
                               \t\t<img src="//wx4.sinaimg.cn/thumb150/88f729efgy1fhcmkzdf2aj20hf0qkwj6.jpg">
         \t\t                                    </li>
                                                    <li class="WB_pic li_4 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcml1wpedj20hs0na77s" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcml1wpedj20hs0na77s:2297899503:0">
                               \t\t<img src="//wx3.sinaimg.cn/thumb150/88f729efgy1fhcml1wpedj20hs0na77s.jpg">
         \t\t                                    </li>
                                                    <li class="WB_pic li_5 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcml4y2f7j20hs0mzn32" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcml4y2f7j20hs0mzn32:2297899503:0">
                               \t\t<img src="//wx1.sinaimg.cn/thumb150/88f729efgy1fhcml4y2f7j20hs0mzn32.jpg">
         \t\t                                    </li>
                                                    <li class="WB_pic li_6 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcml80h9kj20hs0mtn0f" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcml80h9kj20hs0mtn0f:2297899503:0">
                               \t\t<img src="//wx1.sinaimg.cn/thumb150/88f729efgy1fhcml80h9kj20hs0mtn0f.jpg">
         \t\t                                    </li>
                                                    <li class="WB_pic li_7 S_bg1 S_line2 bigcursor " action-data="isPrivate=0&relation=0&pic_id=88f729efgy1fhcmlc1789j20hs12b15c" action-type="fl_pics" suda-uatrack="key=tblog_newimage_feed&value=image_feed_unfold:4127298820857543:88f729efgy1fhcmlc1789j20hs12b15c:2297899503:0">
                               \t\t<img src="//wx4.sinaimg.cn/thumb150/88f729efgy1fhcmlc1789j20hs12b15c.jpg">
         \t\t                                    </li>
            </ul>
                    </div>
    </div>
        <!-- super card-->

                                                                                    <!-- feed区 大数据tag -->
                    </div>
        <div class="WB_feed_like" node-type="templeLike_ani" action-data="parise_id=p_0000" style="display:none;">
            <div class="WB_feed_like" style="background-image:url(//img.t.sinajs.cn/t6/skin/public/like/p_0000_pc.png?version=a97698e78db03400);"></div>
        </div>
    </div>
    <div class="WB_feed_like" node-type="feed_list_options">
        <div class="WB_feed_like">
            <ul class="WB_row_line WB_row_r4 clearfix S_line2">
                                    <li>
                        <a class="S_txt2" suda-uatrack="key=profile_feed&value=collect_guest" href="javascript:void(0);" diss-data="fuid=2297899503" action-type="fl_favorite"><span class="pos"><span class="line S_line1" node-type="favorite_btn_text"><span><em class="W_ficon ficon_favorite S_ficon">û</em><em>收藏</em></span></span></span></a>
                    </li>
                                                                            <li>
                            <a action-data="allowForward=1&url=https://weibo.com/2297899503/Fbsam3B5l&mid=4127298820857543&name=秘密123&uid=2297899503&domain=thesecretapp&pid=88f729efgy1fhcmksyzn0j20hr0q3jua" action-type="fl_forward" action-history="rec=1" href="javascript:void(0);" class="S_txt2" suda-uatrack="key=profile_feed&value=transfer"><span class="pos"><span class="line S_line1" node-type="forward_btn_text"><span><em class="W_ficon ficon_forward S_ficon"></em><em>19</em></span></span></span></a>
                            <span class="arrow"><span class="W_arrow_bor W_arrow_bor_t"><i class="S_line1"></i><em class="S_bg1_br"></em></span></span>
                        </li>
                                                    <li>
                                            <a href="javascript:void(0);" class="S_txt2" action-type="fl_comment" action-data="ouid=2297899503&location=profile&comment_type=0" suda-uatrack="key=profile_feed&value=comment:4127298820857543"><span class="pos"><span class="line S_line1" node-type="comment_btn_text"><span><em class="W_ficon ficon_repeat S_ficon"></em><em>43</em></span></span></span></a>
                                        <span class="arrow"><span class="W_arrow_bor W_arrow_bor_t"><i class="S_line1"></i><em class="S_bg1_br"></em></span></span>
                </li>
                <li class>
                    <!--cuslike用于前端判断是否显示个性赞，1:显示-->
                    <a href="javascript:void(0);" class="S_txt2" action-type="fl_like" action-data="version=mini&qid=heart&mid=4127298820857543&loc=profile&cuslike=1" title="赞" suda-uatrack="key=profile_feed&value=like"><span class="pos"><span class="line S_line1">
                                                                                                                                                                                                                                                                            <span node-type="like_status" class><em class="W_ficon ficon_praised S_txt2">ñ</em><em>44</em></span>                        </span></span></a>
                    <span class="arrow" node-type="cmtarrow"><span class="W_arrow_bor W_arrow_bor_t"><i class="S_line1"></i><em class="S_bg1_br"></em></span></span>
                </li>
            </ul>
        </div>
    </div>
            <div node-type="feed_list_repeat" class="WB_feed_like" style="display:none;"></div>`);	//里面放html代码
console.log($('div').attr('node-type','feed_list_content').html())
