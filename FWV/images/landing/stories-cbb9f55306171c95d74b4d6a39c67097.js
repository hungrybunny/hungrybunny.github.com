!function(e){e.fn.countCharacters=function(t){var t=e.extend({counter:".counter",maxCount:140,overClass:"red",safeClass:"green",nullClass:"grey"},t),n=e(this),i=t.counter+'[data-input-id="'+n.attr("id")+'"]',r=n.closest("form").find(i),o=function(e){var n,i=[t.overClass,t.safeClass,t.nullClass];n=0===e?t.nullClass:0>e?t.overClass:t.safeClass,r.removeClass(i.join(" ")),r.addClass(n)},a=function(e){for(totalLength=e.length,urlRegExp=/(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/[^ ]*)/g;match=urlRegExp.exec(e);)shortenedUrlLength="https"==match[1]?21:20,totalLength=totalLength-match[0].length+shortenedUrlLength;return totalLength},s=function(){var e=a(n.val()),i=t.maxCount-e;o(i),r.text(i),n.trigger("characterCounter:change",[i])};s(),n.bind("paste input keypress keyup propertychange",s)}}(jQuery),$(function(){$.initTwitterJs=function(){$(".stories_answer textarea").each(function(e,t){$(t).countCharacters({counter:".stories_counter",maxCount:$(t).data("counter-max")}),$(t).bind("characterCounter:change",function(e,t){var n=$(this).parents("form").find('input[type="submit"]');n.prop("disabled",0>t)})})};var e=function(e,t){if(t.refresh){var n=$(this).closest("[data-widget-pos]").data("widget-pos");refreshWidgetContent(n)}},t=function(){return $(this).hasClass("authenticated")===!1&&0==$("form.fb_authenticated").length&&(fb_hidden_field=$('input[name="fb[uid]"]:hidden'),0==fb_hidden_field.length)?($(".stories_answer_submit").removeAttr("disabled"),$(".stories_answer_submit").val("Submit answer"),!1):void 0},n=function(){$(this).append('<div class="error_label">There was a problem with your submission.</div>')};$("form.auth_required").live("ajax:error",n).live("ajax:beforeSend",t).live("ajax:success",e),$("a.stories_skip_button").live("click",function(){var e=$(this).closest("form");$(".stories_answer_submit",e).attr("disabled","disabled");var t=$("a.stories_hidden",e.closest(".stories_question")),n=$.param(identityQueryParams());if(""!==n){var i=$(t).attr("href");$(t).attr("href",i+"&"+n)}t.trigger("click")}),$(".stories_answer_share").live("change",function(){var e=$(this).closest("form").closest(".stories_question"),t=$("a.stories_hidden",e).attr("href"),n=$("#"+$(this).data("input-id"));if($(this).is(":checked")){var i=1;isNetwork("facebook")?$("form#new_stories_answer").data("perms","publish_actions"):isNetwork("twitter")&&($("form#new_stories_answer").data("twitter-perms","write"),n.countCharacters({counter:".stories_counter",maxCount:n.data("counter-max")}))}else{var i=0;isNetwork("facebook")?$("form#new_stories_answer").data("perms",""):isNetwork("twitter")&&($("form#new_stories_answer").data("twitter-perms",""),n.countCharacters({counter:".stories_counter"}))}$("a.stories_hidden",e).attr("href",t.replace(/share=./,"share="+i))}),$(".stories_recent_activity a[rel^=external]").attr("target","_blank"),isNetwork("twitter")&&$.initTwitterJs(),$(document).on("didRefreshWidgetContent",function(){isNetwork("twitter")&&$.initTwitterJs()})});