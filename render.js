var page = require('webpage').create();
var system = require('system');
var url = system.args[1];
var output = system.args[2];

page.settings.dpi = 144; // 设置 DPI 为 144

page.open(url, function () {
    page.render(output);
    phantom.exit();
});