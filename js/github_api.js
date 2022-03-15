function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

// some projects lack a language that can be detected by githubs language lib, so in those cases the get overwritten.
// To avoid a ugly null value in the project list
function setOverrideLanguage(obj) {

  var overrideLangConfig = {
    "projects" : [{
      "name": "Vorlage-Prozessmodellierung-Serviceportal",
      "language": "Gradle"
    },
      {
        "name": "satis-config",
        "language": "JSON"
      }]
  };


  var languageKey=obj.language;
  for (var project in overrideLangConfig.projects) {

    if (obj.language == null) {
      if (overrideLangConfig.projects[project].name === obj.name) {
        languageKey = overrideLangConfig.projects[project].language;
      }
    }
  }

  return languageKey;
}

function sbgit_setFilterLanguage(lang) {
  var querySet = $('li.project','#github_projects'),
  $btn = $('button[value='+lang+']','.project_filter');

  if (lang.toLowerCase() != 'all') {
    $('.active','.project_filter').removeClass('active');
    $btn.addClass('active');
    $('li.project').show();
    querySet.each(function () {

      if ($(this).attr('data-language').toLowerCase() != lang.toLowerCase()) {
        $(this).hide();
      }
    });
  }

  if (lang.toLowerCase() == 'all')
  {
    $('li.project').show();
  }


}

function sbgit_showInfo(){

  $('body').on('click','.hint',function(){
    var id = $(this).attr('data-hintbtn'),
    descr=$("div[data-hintdescr="+id+"]");
    descr.css('background-color','#FFFFFF');
    descr.show();
    descr.animate({"top":"0px", "opacity": "1"}, "slow");


    // hide all other description that are open
    $('.dialog').not(descr).animate({"top":"-100%", "opacity": "0"}, "slow");

    setTimeout(() => {
      $('.dialog').not(descr).removeAttr("style");
    }, 200);

  });


  $('body').on('click','.dialog',function(){
    $(this).animate({"top":"-100%", "opacity": "0"}, "slow");

    setTimeout(() => {
      $(this).removeAttr("style");
    }, 200);
  });
}

$(document).ready(function () {
  var api = "https://api.github.com/orgs/Seitenbau/repos";
  var langArr = [];
  sbgit_showInfo();


  $.get(api, function (data) {



    $.each(data, function (idx, obj) {


      langArr.push(setOverrideLanguage(obj));


      $("#github_projects").append(
        "<li data-language=\""+setOverrideLanguage(obj)+"\" data-count=\""+obj.stargazers_count+"\" data-fork=\""+obj.forks_count+"\" class=\"project\">" +
        "<div class='inner'>" +
        "<div class='button-standard'>" +
        "<a title=\""+obj.name+"\" href=\""+obj.html_url+"\" alt=\"github projekt\" target=\"_blank\">" +
        "<span>"+obj.name+"</span></div>" +
        "</a>" +
        "<div class='info'>" +
        "<span class='description'>"+(obj.description?obj.description: "<span style='top:0;left:0;color: #A3A3A3;'>Keine Beschreibung vorhanden.</span>")+"</span>" +
        "</div>" +
        "<div class='info-row'>" +
        "<div class='counts'><span class='stargazers'>"+obj.stargazers_count+"</span>" +
        "<span class='forks'>"+obj.forks_count+"</span></div>" +
        "<span class='language'>"+setOverrideLanguage(obj)+"</span>" +
        "</div>" +
        "</div>" +
        "<div data-hintdescr=\""+obj.id+"\" class=\"dialog\">"+
        "<div class='button-standard'>" +
        "<a title=\""+obj.name+"\" href=\""+obj.html_url+"\" alt=\"github projekt\" target=\"_blank\">" +
        "<span>"+obj.name+"</span></div>" +
        "</a>" +
        "<div  class='info'>" +
        "<span class='descriptionhint'>"+(obj.description?obj.description: "<span style='top:0;left:0;color: #A3A3A3;'>Keine Beschreibung vorhanden.</span>")+"</span>" +
        "</div>" +
        "<div data-hintbtn=\""+obj.id+"\" class=\"close_dialog\">"+
        "</div>"+
        "</div>" +
        "<div data-hintbtn=\""+obj.id+"\" class=\"hint\">"+
        "</div>"+
        "</li>");
    });

    langArr = langArr.filter(onlyUnique);

    // append twice so it appears in th dropdown, when something else is selected
    $('.project_filter_select').append('<option value="All">All</option>');
    $('.project_filter_select').append('<option value="All">All</option>');

    $('.project_filter').append('<li><button value="All">All</button></li>');
    for (var lang in langArr) {


      $('.project_filter_select').append('<option value="'+langArr[lang]+'">'+langArr[lang]+'</option>');


      $('.project_filter').append('<li><button value="'+langArr[lang]+'">'+langArr[lang]+'</button></li>');
    }
    $('button','.project_filter').on('click',function(){
      sbgit_setFilterLanguage($(this).attr('value'));
    });
    $('.project_filter_select').change(function(){
      sbgit_setFilterLanguage($('option:selected',this).attr('value'));
    });

  });

});
