$(document).ready(function () {
  var api = "https://api.github.com/orgs/Seitenbau/repos";
  $.get(api, function (data) {
    $.each(data, function (idx, obj) {
      $("#github_projects").append("<li class=\"project\"><a href=\""+obj.html_url+"\" alt=\"github projekt\" target=\"_blank\">" +
        "<div class='inner'>" +
        "<div class='info'>" +
        "<div class='counts'><span class='stargazers'>"+obj.stargazers_count+"</span>" +
        "<span class='forks'>"+obj.forks_count+"</span></div>" +
        "<span class='language'>"+obj.language+"</span>" +
        "<span class='description'>"+obj.description?obj.description:""+"</span>" +
        "</div>" +
        "<div class='button-standard'><span>"+obj.name+"</span></div>" +
        "</div></a></li>");
    });
  });
});
