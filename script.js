// some projects lack a language that can be detected by githubs language lib, so in those cases the get overwritten.
// To avoid a ugly null value in the project list
function setOverrideLanguage(obj) {
  if (obj.language !== null) {
    return obj.language;
  }

  const overrideLangConfig = {
    projects: [
      {
        name: "Vorlage-Prozessmodellierung-Serviceportal",
        language: "Gradle",
      },
      {
        name: "satis-config",
        language: "JSON",
      },
    ],
  };

  for (const project of overrideLangConfig.projects) {
    if (project.name === obj.name) {
      return project.language;
    }
  }

  return obj.language;
}

function sbgit_setFilterLanguage(lang) {
  const projects = document.querySelectorAll("#github_projects li.project");
  const buttons = document.querySelectorAll(".project_filter button");

  // Remove active class from all buttons
  document
    .querySelectorAll(".project_filter .active")
    .forEach((btn) => btn.classList.remove("active"));

  // Set active button
  buttons.forEach((btn) => {
    if (btn.value === lang) {
      btn.classList.add("active");
    }
  });

  // Show all projects first
  projects.forEach((project) => {
    project.style.display = "";
  });

  if (lang.toLowerCase() !== "all") {
    projects.forEach((project) => {
      if (project.dataset.language.toLowerCase() !== lang.toLowerCase()) {
        project.style.display = "none";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  //var api = "https://api.github.com/orgs/Seitenbau/repos";
  const api = "/repos.json";
  const langArr = [];

  const response = await fetch(api);
  const data = await response.json();

  const githubProjects = document.getElementById("github_projects");
  const projectFilterSelect = document.querySelector(".project_filter_select");
  const projectFilter = document.querySelector(".project_filter");

  data.forEach((obj) => {
    const language = setOverrideLanguage(obj);
    langArr.push(language);

    const description = obj.description
      ? obj.description
      : "<span style='top:0;left:0;color: #A3A3A3;'>Keine Beschreibung vorhanden.</span>";

    githubProjects.insertAdjacentHTML(
      "beforeend",
      `<li data-language="${language}" data-count="${obj.stargazers_count}" data-fork="${obj.forks_count}" class="project">
        <div class="inner">
          <div class="button-standard">
            <a title="${obj.name}" href="${obj.html_url}" target="_blank">
              <span>${obj.name}</span>
            </a>
          </div>
          <div class="info">
            <span class="description">${description}</span>
          </div>
          <div class="info-row">
            <div class="counts">
              <span class="stargazers">${obj.stargazers_count}</span>
              <span class="forks">${obj.forks_count}</span>
            </div>
            <span class="language">${language}</span>
          </div>
        </div>
      </li>`,
    );
  });

  const uniqueLangs = [...new Set(langArr)];

  projectFilterSelect.insertAdjacentHTML(
    "beforeend",
    '<option value="All">All</option>',
  );

  projectFilter.insertAdjacentHTML(
    "beforeend",
    '<li><button class="active" value="All">All</button></li>',
  );

  uniqueLangs.forEach((lang) => {
    projectFilterSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${lang}">${lang}</option>`,
    );

    projectFilter.insertAdjacentHTML(
      "beforeend",
      `<li><button value="${lang}">${lang}</button></li>`,
    );
  });

  // Attach click handlers to filter buttons
  document.querySelectorAll(".project_filter button").forEach((btn) => {
    btn.addEventListener("click", () => {
      sbgit_setFilterLanguage(btn.value);
    });
  });

  // Attach change handler to filter select
  projectFilterSelect.addEventListener("change", () => {
    sbgit_setFilterLanguage(
      projectFilterSelect.options[
        projectFilterSelect.selectedIndex
      ].getAttribute("value"),
    );
  });
});
