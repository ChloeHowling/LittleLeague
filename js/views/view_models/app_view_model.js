import teamsPageViewModel from './team_view_model.js'
import homePageViewModel from './home_page_view_model.js'
import playerViewModel from './player_view_model.js';

let routes = [
    {
        name: "#home",
        title: "Home",
        defaultOptions: null,
        isDefaultView: true,
        viewType: "generic",
        viewModel: homePageViewModel
    },
    {
        name: "#teams",
        title: "Teams",
        defaultOptions: {sortCol: 'name', sortDir: 'asc'},
        isDefaultView: false,
        viewType: "list",
        viewModel: teamsPageViewModel
    },
    {
        name: "#players",
        title: "Players",
        defaultOptions: {sortCol: 'name', sortDir: 'asc'},
        isDefaultView: false,
        viewType: "list",
        viewModel: playerViewModel
    }
]

// var appViewModel = {
//     endPoint: "localhost:8080",
//     viewModel: teamViewModel,
// }

let appViewModel = {
    containerId: "app_container",
    endPoint: "localhost:8080",
    routes: routes,
    navContainerId: "navContainer",
    navTemplateUrl: "./js/views/partials/nav.ejs"
}

export default appViewModel;