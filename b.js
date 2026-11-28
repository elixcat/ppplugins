(function () {
    'use strict';

    Lampa.Platform.tv();

var pluginInfo={
'type':"other",'version':'2.8.7','author':"@bylampa",'name':"Card Buttons Editor",'description':"Редактирование порядка, видимости, названий и группировка кнопок в карточке",'component':"card_buttons_editor"
}
,STYLE_ID='card-buttons-editor-style',STORAGE_ORDER="card_buttons_order",STORAGE_HIDE="card_buttons_hide",STORAGE_SHOW_NAMES="card_buttons_show_names",STORAGE_TITLES="card_buttons_titles",STORAGE_ICONS="card_buttons_icons",STORAGE_ORIGINAL_TITLES='card_buttons_original_titles',STORAGE_ORIGINAL_ICONS="card_buttons_original_icons",STORAGE_FOLDERS="card_buttons_folders",STORAGE_FOLDER_TITLES='card_buttons_folder_titles',STORAGE_FOLDER_ICONS="card_buttons_folder_icons",STORAGE_FOLDER_HIDE="card_buttons_folder_hide",STORAGE_ITEM_ORDER="card_buttons_item_order",currentCard=null,_0x5b7cdf=null,_0x1036a9=null,_0x254f19=null,buttonList=[],defaultTitles={
'button--play':function _0x29b3c4(){
var _0x4db17e=_0x1e843c;
return Lampa["Lang"]["translate"]("title_watch");

}
,'button--book':function _0x20ca1d(){
var _0x4a6fb2=_0x1e843c;
return Lampa["Lang"]["translate"]("settings_input_links");

}
,'button--reaction':function _0x26f6b7(){
var _0x360dc9=_0x1e843c;
return Lampa["Lang"]["translate"]("title_reactions");

}
,'button--subscribe':function _0x22e989(){
var _0x6c1d6d=_0x1e843c;
return Lampa['Lang']['translate']("title_subscribe");

}
,'button--options':function _0x5e7707(){
var _0x539849=_0x1e843c;
return Lampa["Lang"]["translate"]("more");

}
,'view--torrent':function _0x487e9e(){
var _0x543a6d=_0x1e843c;
return Lampa["Lang"]["translate"]("full_torrents");

}
,'view--trailer':function _0x1ffe9c(){
var _0x3818cc=_0x1e843c;
return Lampa["Lang"]["translate"]('full_trailers');

}

}
,iconPresets=[{
'name':'Плей','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><polygon points=\"5 3 19 12 5 21 5 3\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Фильм','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M2 12h20M7 2v20M17 2v20\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Звезда",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'ТВ','svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><rect\x20x=\x222\x22\x20y=\x223\x22\x20width=\x2220\x22\x20height=\x2215\x22\x20rx=\x222\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><path\x20d=\x22M8\x2021h8M12\x2018v3\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':"Поиск",'svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><circle\x20cx=\x2211\x22\x20cy=\x2211\x22\x20r=\x228\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><path\x20d=\x22M21\x2021l-4.35-4.35\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':"Дом",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M9 22V12h6v10\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Огонь",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 2C7.5 6.5 4 10 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4-3.5-7.5-8-12z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M12 22c-1.5-2-2-4-2-6 0-2 1-4 2-6\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Часы','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"2\"/><polyline points=\"12 6 12 12 16 14\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Календарь",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M16 2v4M8 2v4M3 10h18\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Скачать','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Поделиться",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"18\" cy=\"5\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"12\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"18\" cy=\"19\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Сердце','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Закладка','svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M19\x2021l-7-5-7\x205V5a2\x202\x200\x20012-2h10a2\x202\x200\x20012\x202v16z\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':'Глаз','svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M1\x2012s4-8\x2011-8\x2011\x208\x2011\x208-4\x208-11\x208-11-8-11-8z\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x223\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':"Настройки",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Список",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Инфо",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\" stroke=\"currentColor\" stroke-width=\"2\"/><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Замок",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M7 11V7a5 5 0 0110 0v4\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Пользователь','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"7\" r=\"4\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Колокол",'svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M18\x208A6\x206\x200\x20006\x208c0\x207-3\x209-3\x209h18s-3-2-3-9M13.73\x2021a2\x202\x200\x2001-3.46\x200\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':'Прямой\x20эфир','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"4\" fill=\"currentColor\"/></svg>"
}
,{
'name':'Молния','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Фильтр",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Папка",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Кинотеатр",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z\" fill=\"currentColor\"/></svg>"
}
,{
'name':'Видеокамера','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M23 7l-7 5 7 5V7z\" stroke=\"currentColor\" stroke-width=\"2\"/><rect x=\"1\" y=\"5\" width=\"15\" height=\"14\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Музыка",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M9 18V5l12-2v13\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"6\" cy=\"18\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"18\" cy=\"16\" r=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Микрофон",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"9\" y=\"1\" width=\"6\" height=\"11\" rx=\"3\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M5 11a7 7 0 0014 0M12 19v4M8 23h8\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Диск','svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x2210\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x223\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><path\x20d=\x22M12\x202v20\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':"Компас",'svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><circle\x20cx=\x2212\x22\x20cy=\x2212\x22\x20r=\x2210\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><path\x20d=\x22M16.24\x207.76l-2.12\x206.36-6.36\x202.12\x202.12-6.36\x206.36-2.12z\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':"Глобус",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Трофей",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M6 9H4a2 2 0 010-4h2M18 9h2a2 2 0 000-4h-2M8 21h8M12 17v4M7 5h10v4a5 5 0 01-10 0V5z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Маска",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"8.5\" cy=\"10\" r=\"1.5\" fill=\"currentColor\"/><circle cx=\"15.5\" cy=\"10\" r=\"1.5\" fill=\"currentColor\"/><path d=\"M8 14c.83 2.67 4 2.67 8 0\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Корона",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M2 17l3-12 4 7 3-8 3 8 4-7 3 12H2z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M2 17h20v3H2z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Щит",'svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><path\x20d=\x22M12\x2022s8-4\x208-10V5l-8-3-8\x203v7c0\x206\x208\x2010\x208\x2010z\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><path\x20d=\x22M9\x2012l2\x202\x204-4\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
,{
'name':"Ключ",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"8\" cy=\"12\" r=\"5\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M12 12h9l-2 3 2 3h-3l-2-3\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Рейтинг','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"3\" y=\"12\" width=\"4\" height=\"9\" rx=\"1\" stroke=\"currentColor\" stroke-width=\"2\"/><rect x=\"10\" y=\"7\" width=\"4\" height=\"14\" rx=\"1\" stroke=\"currentColor\" stroke-width=\"2\"/><rect x=\"17\" y=\"3\" width=\"4\" height=\"18\" rx=\"1\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Плеер','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><polygon points=\"10 8 10 16 16 12\" fill=\"currentColor\"/></svg>"
}
,{
'name':"Сериал",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"18\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M2 7h20M2 11h20M2 15h20M2 19h20\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':"Буфер",'svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M12 2a10 10 0 010 20\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Эфир','svg':"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M12 2L2 7l10 5 10-5-10-5z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M2 17l10 5 10-5M2 12l10 5 10-5\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>"
}
,{
'name':'Коллекция','svg':'<svg\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22><rect\x20x=\x222\x22\x20y=\x222\x22\x20width=\x229\x22\x20height=\x229\x22\x20rx=\x221\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><rect\x20x=\x2213\x22\x20y=\x222\x22\x20width=\x229\x22\x20height=\x229\x22\x20rx=\x221\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><rect\x20x=\x222\x22\x20y=\x2213\x22\x20width=\x229\x22\x20height=\x229\x22\x20rx=\x221\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/><rect\x20x=\x2213\x22\x20y=\x2213\x22\x20width=\x229\x22\x20height=\x229\x22\x20rx=\x221\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22/></svg>'
}
],defaultFolderIcon='<svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x222\x22><path\x20d=\x22M22\x2019a2\x202\x200\x200\x201-2\x202H4a2\x202\x200\x200\x201-2-2V5a2\x202\x200\x200\x201\x202-2h5l2\x203h9a2\x202\x200\x200\x201\x202\x202z\x22></path></svg>';
function _0xa4804a(){
var _0x5845aa=_0x1e843c;
return window['innerWidth']<=0x249?"small":"medium";

}
function _0x3868cb(){
var _0x172144=_0x1e843c;
if(document["getElementById"](STYLE_ID))return;
var _0x413714="            .button-hide {
                display: none !important;
            
}
                        .button--play {
                display: none !important;
            
}
                        @keyframes button-fade-in {
                from {
 opacity: 0;
 transform: translateY(5px);
 
}
                to {
 opacity: 1;
 transform: translateY(0);
 
}
            
}
                        .full-start-new__buttons .full-start__button {
                opacity: 0;
                animation: button-fade-in 0.3s ease forwards;
            
}
                        .full-start-new__buttons.buttons-loading .full-start__button {
                visibility: hidden !important;
                animation: none;
            
}
                        .button--folder {
                cursor: pointer;
            
}
                        .folder-hidden {
                display: none !important;
            
}
                        .menu-edit-split {
                margin: 1em 1em;
                height: 0;
                border-top: 2px solid rgba(255, 255, 255, 0.1);
            
}
                        .menu-edit-list__item {
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                padding: 0.3em;
                -webkit-border-radius: 0.3em;
                -moz-border-radius: 0.3em;
                border-radius: 0.3em;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                border: 3px solid transparent;
            
}
                        .menu-edit-list__item:nth-child(even) {
                background: rgba(255, 255, 255, 0.1);
            
}
                        .menu-edit-list__item.folder-item {
                background: rgba(255, 200, 50, 0.15) !important;
                border-left: 3px solid rgba(255, 200, 50, 0.5);
            
}
                        .menu-edit-list__item.folder-hidden-item {
                opacity: 0.4;
            
}
                        .menu-edit-list__item.button-hidden-item {
                opacity: 0.4;
            
}
                        .menu-edit-list__icon {
                width: 2.4em;
                height: 2.4em;
                margin-right: 1em;
                -webkit-flex-shrink: 0;
                -ms-flex-negative: 0;
                flex-shrink: 0;
                -webkit-border-radius: 100%;
                -moz-border-radius: 100%;
                border-radius: 100%;
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -moz-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
            
}
                        .menu-edit-list__icon > svg, .menu-edit-list__icon > img {
                width: 1.4em !important;
                height: 1.4em !important;
            
}
                        .menu-edit-list__title {
                font-size: 1.3em;
                font-weight: 300;
                line-height: 1.2;
                -webkit-box-flex: 1;
                -webkit-flex-grow: 1;
                -moz-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
            
}
                        .menu-edit-list__title-sub {
                opacity: 0.5;
                font-size: 0.85em;
            
}
                        .menu-edit-list__move,            .menu-edit-list__toggle,            .menu-edit-list__edit,            .menu-edit-list__icon-edit,            .menu-edit-list__delete {
                width: 2.4em;
                height: 2.4em;
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -moz-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                cursor: pointer;
                border: 3px solid transparent;
            
}
                        .menu-edit-list__move svg,            .menu-edit-list__toggle svg,            .menu-edit-list__edit svg,            .menu-edit-list__icon-edit svg,            .menu-edit-list__delete svg {
                width: 1.4em !important;
                height: 1.4em !important;
            
}
                        .menu-edit-list__move.focus,            .menu-edit-list__toggle.focus,            .menu-edit-list__edit.focus,            .menu-edit-list__icon-edit.focus,            .menu-edit-list__delete.focus {
                background: white;
                -webkit-border-radius: 0.3em;
                -moz-border-radius: 0.3em;
                border-radius: 0.3em;
                color: #000;
                border-color: transparent;
            
}
                        .menu-edit-list__toggle svg {
                width: 1.4em !important;
                height: 1.4em !important;
            
}
                        .menu-edit-list__create-folder {
                background: rgba(100,200,100,0.2);
                margin-bottom: 1em;
                border: 3px solid transparent;
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -moz-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
            
}
                        .menu-edit-list__create-folder .menu-edit-list__icon {
                margin-right: 0.5em;
            
}
                        .menu-edit-list__create-folder .menu-edit-list__title {
                -webkit-box-flex: 0;
                -webkit-flex-grow: 0;
                -moz-box-flex: 0;
                -ms-flex-positive: 0;
                flex-grow: 0;
            
}
                        .menu-edit-list__create-folder.focus {
                background: rgba(100,200,100,0.3);
                border-color: rgba(255,255,255,0.8);
            
}
                        .folder-create-confirm {
                background: rgba(100,200,100,0.3);
                margin-top: 1em;
                border-radius: 0.3em;
                border: 3px solid transparent;
                font-size: 1.3em;
                font-weight: 300;
                line-height: 1.2;
            
}
                        .folder-create-confirm > div {
                text-align: center;
                padding: 0.3em;
            
}
                        .folder-create-confirm.focus {
                border-color: rgba(255,255,255,0.8);
            
}
                        .folder-reset-button {
                background: rgba(200,80,80,0.6);
                margin: 1em 0 0 0;
                border-radius: 0.3em;
                border: 3px solid transparent;
                text-align: center;
                padding: 0.5em 0.3em;
                font-size: 1.3em;
                font-weight: 300;
                line-height: 1.2;
            
}
                        .folder-reset-button.focus {
                border-color: rgba(255,255,255,0.8);
            
}
                        .reset-button {
                background: rgba(200,80,80,0.6);
                margin: 1em 3px 0 3px;
                border-radius: 0.3em;
                text-align: center;
                padding: 1em;
                cursor: pointer;
                order: 9999 !important;
            
}
                        .reset-button.focus {
                box-shadow: 0 0 0 3px rgba(255,255,255,0.8);
            
}
                        .icon-reset-button {
                background: rgba(200,80,80,0.6);
                margin: 0.5em 0.3em;
                border-radius: 0.3em;
                text-align: center;
                padding: 0.8em;
                cursor: pointer;
                width: calc(100% - 0.6em);
                font-size: 1.3em;
                font-weight: 300;
                line-height: 1.2;
            
}
                        .icon-reset-button.focus {
                box-shadow: 0 0 0 3px rgba(255,255,255,0.8);
            
}
                        .icon-picker-list {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            
}
                        .icon-picker-item {
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                width: 4em;
                height: 4em;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -moz-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                cursor: pointer;
                border-radius: 0.3em;
                margin: 0.3em;
            
}
                        .icon-picker-item.focus {
                background: rgba(255,255,255,0.2);
            
}
                        .icon-picker-icon {
                width: 2.4em;
                height: 2.4em;
                display: -webkit-box;
                display: -webkit-flex;
                display: -moz-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                -moz-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                -moz-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
            
}
                        .icon-picker-icon svg {
                width: 1.6em !important;
                height: 1.6em !important;
            
}
                        .rating-value {
                background: none !important;
                padding: 0 !important;
                border-radius: 0 !important;
                color: inherit !important;
                font-size: inherit !important;
            
}
                        @media (min-width: 586px) {
                .full-start-new__buttons {
                    display: flex !important;
                    flex-wrap: wrap !important;
                
}
                                .full-start__button {
                    margin-bottom: 10px !important;
                
}
            
}
                        @media (max-width: 585px) {
                .full-start-new__buttons {
                    display: flex !important;
                    flex-wrap: wrap !important;
                
}
                                .full-start__button {
                    margin-bottom: 10px !important;
                
}
            
}
        ";
$("head")['append']('<style\x20id=\x22'+STYLE_ID+'\x22>'+_0x413714+'</style>');

}
function _0x2e6676(_0x4ebd39){
var _0x21d506=_0x1e843c,_0x1d86af=Lampa["Storage"]["get"](_0x4ebd39);
if(Array["isArray"](_0x1d86af))return _0x1d86af["slice"]();
if(typeof _0x1d86af==="string")try{
var _0xe52307=JSON["parse"](_0x1d86af);
return Array['isArray'](_0xe52307)?_0xe52307:[];

}
catch(_0x49d6b2){
return _0x1d86af['split'](',')["map"](function(_0x5524de){
return _0x5524de['trim']();

}
)['filter'](Boolean);

}
return[];

}
function _0x255a37(_0x42fd7b){
var _0x181b9a=_0x1e843c,_0x4270cf={

}
;
return Object['keys'](_0x42fd7b)["forEach"](function(_0x376704){
_0x4270cf[_0x376704]=_0x42fd7b[_0x376704];

}
),_0x4270cf;

}
function _0x36b91b(){
var _0x5620d8=_0x1e843c,_0x205f32=Lampa['Storage']["get"](STORAGE_FOLDER_TITLES);
if(_0x205f32&&typeof _0x205f32==="object")return _0x255a37(_0x205f32);
return{

}
;

}
function _0x586ca3(_0xe83426,_0x5be9f8){
var _0x14c054=_0x1e843c,_0x4df047=_0x36b91b();
_0x4df047[_0xe83426]=_0x5be9f8,Lampa["Storage"]["set"](STORAGE_FOLDER_TITLES,_0x4df047);

}
function _0x2a8e21(){
var _0x4a369e=_0x1e843c,_0x4baddb=Lampa["Storage"]['get'](STORAGE_FOLDER_ICONS);
if(_0x4baddb&&typeof _0x4baddb==="object")return _0x255a37(_0x4baddb);
return{

}
;

}
function _0x763ec(_0x3654b0,_0x22f9b2){
var _0x7a7864=_0x1e843c,_0x978187=_0x2a8e21();
_0x978187[_0x3654b0]=_0x22f9b2,Lampa["Storage"]['set'](STORAGE_FOLDER_ICONS,_0x978187);

}
function _0x361162(){
var _0x2d6907=_0x1e843c,_0x12a5ca=Lampa['Storage']["get"](STORAGE_FOLDERS);
if(_0x12a5ca&&typeof _0x12a5ca==="object")return _0x255a37(_0x12a5ca);
return{

}
;

}
function _0xab48b7(_0x40bccb){
var _0x471345=_0x1e843c;
Lampa["Storage"]["set"](STORAGE_FOLDERS,_0x255a37(_0x40bccb));

}
function _0x5a9894(){
var _0x10abc5=_0x1e843c,_0x157aec=Lampa["Storage"]["get"](STORAGE_FOLDER_HIDE);
return Array["isArray"](_0x157aec)?_0x157aec:[];

}
function _0x1883f3(_0x3494ff){
var _0x494f20=_0x1e843c;
Lampa["Storage"]["set"](STORAGE_FOLDER_HIDE,_0x3494ff);

}
function _0x12f927(){
var _0x5aca13=Lampa['Storage']['get'](STORAGE_ITEM_ORDER);
return Array['isArray'](_0x5aca13)?_0x5aca13:[];

}
function _0x2350f7(_0x169682){
var _0x51e96d=_0x1e843c;
Lampa["Storage"]["set"](STORAGE_ITEM_ORDER,_0x169682);

}
function _0x354ca4(_0x2640fd){
var _0x39ca6d=_0x1e843c,_0x28aeb5=_0x361162();
delete _0x28aeb5[_0x2640fd],_0xab48b7(_0x28aeb5);
var _0x34e170=_0x36b91b();
delete _0x34e170[_0x2640fd],Lampa["Storage"]['set'](STORAGE_FOLDER_TITLES,_0x34e170);
var _0x77a1fe=_0x2a8e21();
delete _0x77a1fe[_0x2640fd],Lampa["Storage"]["set"](STORAGE_FOLDER_ICONS,_0x77a1fe);
var _0x2e418b=_0x5a9894(),_0x2eba98=_0x2e418b["indexOf"](_0x2640fd);
_0x2eba98!==-0x1&&(_0x2e418b['splice'](_0x2eba98,0x1),_0x1883f3(_0x2e418b));
var _0x5a2183=_0x12f927(),_0x2bdcef=[];
_0x5a2183["forEach"](function(_0x235888){
var _0x36bae2=_0x39ca6d;
!(_0x235888['type']==="folder"&&_0x235888['id']===_0x2640fd)&&_0x2bdcef["push"](_0x235888);

}
),_0x2350f7(_0x2bdcef);

}
function _0x4bb9bd(){
var _0x2d489b=_0x1e843c,_0x4e23de=_0x361162(),_0x25ef9c=[];
return Object["keys"](_0x4e23de)["forEach"](function(_0x2e1a13){
var _0x44d3c7=_0x2d489b;
Array['isArray'](_0x4e23de[_0x2e1a13])&&(_0x25ef9c=_0x25ef9c["concat"](_0x4e23de[_0x2e1a13]));

}
),_0x25ef9c;

}
function _0x37a7a8(_0x49f64b){
var _0x1e0217=_0x1e843c,_0x2dfa7d=_0x361162();
for(var _0x3e0790 in _0x2dfa7d){
if(Array["isArray"](_0x2dfa7d[_0x3e0790])&&_0x2dfa7d[_0x3e0790]['includes'](_0x49f64b))return _0x3e0790;

}
return null;

}
function _0x2ffe0a(_0x3eb08e){
var _0x67ef76=_0x1e843c;
if(!currentCard||!currentCard["length"])return null;
var _0x40f8c8=currentCard["find"](".full-start__button[data-button-id=\""+_0x3eb08e+'\x22]')["first"]();
if(_0x40f8c8['length'])return _0x40f8c8;
for(var _0x49084d=0x0;
_0x49084d<buttonList["length"];
_0x49084d++){
if(_0x5510f6(buttonList[_0x49084d])===_0x3eb08e)return buttonList[_0x49084d];

}
return null;

}
function _0x29cbe1(_0x215dea){
var _0x9dd424=_0x1e843c,_0x232a56=$(_0x215dea),_0x128203=_0x5510f6(_0x232a56),_0x547e17=_0x3f96f1()[_0x128203];
if(_0x547e17)return _0x547e17;
var _0x606e0f=_0x232a56["find"]("span")["first"]()["text"]()["trim"]()||_0x232a56['text']()["trim"]();
if(!_0x606e0f){
var _0x5a8eaa=_0x232a56["attr"]("class")||'',_0x49ea58=_0x5a8eaa["split"]('\x20')["find"](function(_0x27293b){
var _0x2cd6f5=_0x9dd424;
return _0x27293b['indexOf']("view--")===0x0||_0x27293b["indexOf"]("button--")===0x0;

}
);
_0x49ea58?(_0x606e0f=_0x49ea58["replace"]("view--",'')['replace']("button--",'')["replace"](/_/g,'\x20'),_0x606e0f=_0x606e0f["charAt"](0x0)["toUpperCase"]()+_0x606e0f['slice'](0x1)):_0x606e0f="Кнопка";

}
return _0x606e0f;

}
function _0xbe6507(_0xd64485){
var _0x35a4c1=_0x1e843c,_0x1e6f68=_0x36b91b(),_0x3d94a4=_0x2a8e21(),_0x5bf585=_0x361162(),_0x562a84=_0x1e6f68[_0xd64485]||"Папка",_0x37d6f8=_0x3d94a4[_0xd64485]||defaultFolderIcon,_0x4514ca=_0x5bf585[_0xd64485]||[],_0x226acf=$("<div>")['addClass']("full-start__button selector button--folder")["attr"]("data-folder-id",_0xd64485)["append"]($(_0x37d6f8))['append']($('<span>')["text"](_0x562a84));
return _0x226acf['on']("hover:enter",function(){
_0x23cc06(_0xd64485);

}
),_0x226acf['on']("hover:long",function(){
openEditorMenu(currentCard);

}
),_0x226acf;

}
function _0x23cc06(_0x23a027){
var _0x3caf3f=_0x1e843c,_0x3431cf=_0x361162(),_0x4f5714=_0x36b91b(),_0x37e39d=_0x4f5714[_0x23a027]||"Папка",_0x1ebea0=_0x3431cf[_0x23a027]||[],_0x20b259=[];
_0x1ebea0["forEach"](function(_0x4f8de1){
var _0x216b12=_0x3caf3f,_0x38af32=_0x2ffe0a(_0x4f8de1);
if(_0x38af32){
var _0x5e6475=_0x38af32["jquery"]?_0x38af32:$(_0x38af32),_0x56b75e=_0x29cbe1(_0x5e6475),_0x108862=_0x5e6475['find']("svg")['first'](),_0x55439a=_0x108862["length"]?_0x108862["prop"]('outerHTML'):'',_0x10f656={
'title':_0x56b75e["replace"](/<[^>]*>/g,''),'onSelect':function(){
var _0xb78db8=_0x216b12;
_0x5e6475["length"]&&_0x5e6475["trigger"]("hover:enter");

}

}
;
_0x55439a&&(_0x10f656["template"]="selectbox_icon",_0x10f656['icon']=_0x55439a),_0x20b259["push"](_0x10f656);

}

}
),_0x20b259["push"]({
'title':'Редактировать\x20содержимое','onSelect':function(){
_0x48d2bc(_0x23a027);

}

}
),_0x20b259["push"]({
'title':'Изменить\x20порядок','onSelect':function(){
_0x266fce(_0x23a027);

}

}
),Lampa["Select"]["show"]({
'title':_0x37e39d,'items':_0x20b259,'onBack':function(){
var _0x3ffc06=_0x3caf3f;
Lampa["Controller"]["toggle"]("content");

}

}
);

}
function _0x48d2bc(_0x434688){
var _0x2df37c=_0x1e843c,_0x394f2d=_0x361162(),_0x49d72b=_0x36b91b(),_0x428f1c=_0x49d72b[_0x434688]||"Папка",_0x7c04d7=_0x394f2d[_0x434688]||[],_0x7a821b=_0x4bb9bd(),_0x28a774=_0x7c04d7['slice'](),_0x479b89=$("<div class=\"menu-edit-list\"></div>"),_0x1f1291=[];
buttonList["forEach"](function(_0x2ab152){
var _0x5db7dd=_0x2df37c,_0x13f148=_0x5510f6(_0x2ab152);
(_0x7c04d7["indexOf"](_0x13f148)!==-0x1||_0x7a821b["indexOf"](_0x13f148)===-0x1)&&_0x1f1291["push"](_0x2ab152);

}
);
var _0x3c763d={

}
;
_0x1f1291["forEach"](function(_0x337f53){
var _0x17fdcf=_0x2df37c,_0x2fab99=_0x337f53['find']("span")['first']()["text"]()["trim"]()||_0x337f53["text"]()["trim"]();
_0x2fab99&&(_0x3c763d[_0x2fab99]=(_0x3c763d[_0x2fab99]||0x0)+0x1);

}
),_0x1f1291['forEach'](function(_0x16fb4f){
var _0x4a1c08=_0x2df37c,_0x284525=_0x5510f6(_0x16fb4f),_0x531245=_0x29cbe1(_0x16fb4f),_0x8750ec=_0x16fb4f['find']("svg")["first"](),_0x1569f7=_0x8750ec["length"]?_0x8750ec["clone"]():$("<svg></svg>"),_0x2e35c6=_0x28a774['indexOf'](_0x284525)!==-0x1,_0x134a4b=_0x16fb4f["find"]("span")["first"]()["text"]()['trim']()||_0x16fb4f["text"]()["trim"]();
if(_0x134a4b&&_0x3c763d[_0x134a4b]>0x1){
var _0x2135fd=_0x16fb4f["attr"]("class")||'',_0xc3f835=_0x16fb4f["attr"]("data-subtitle")||_0x16fb4f['attr']("data-name")||_0x16fb4f["attr"]("data-id")||'';
if(_0xc3f835){
var _0x1b304d=_0xc3f835['split'](/\s+/)[0x0];
if(_0x1b304d['length']>0x1e)_0x1b304d=_0x1b304d["substring"](0x0,0x1e);
_0x531245=_0x134a4b+'\x20('+_0x1b304d+')';

}
else{
var _0x2e393f=_0x2135fd['match'](/(?:button--|view--)(\w+)/);
_0x2e393f&&_0x2e393f[0x1]&&(_0x531245=_0x134a4b+'\x20('+_0x2e393f[0x1]+')');

}

}
var _0x52c6e0=$("<div class=\"menu-edit-list__item\">                <div class=\"menu-edit-list__icon\"></div>                <div class=\"menu-edit-list__title\">"+_0x531245+"</div>                <div class=\"menu-edit-list__toggle selector\">                    <svg width=\"26\" height=\"26\" viewBox=\"0 0 26 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                        <rect x=\"1.89111\" y=\"1.78369\" width=\"21.793\" height=\"21.793\" rx=\"3.5\" stroke=\"currentColor\" stroke-width=\"3\"/>                        <path d=\"M7.44873 12.9658L10.8179 16.3349L18.1269 9.02588\" stroke=\"currentColor\" stroke-width=\"3\" class=\"dot\" opacity=\""+(_0x2e35c6?'1':'0')+"\" stroke-linecap=\"round\"/>                    </svg>                </div>            </div>");
_0x52c6e0["find"](".menu-edit-list__icon")["append"](_0x1569f7),_0x52c6e0["find"](".menu-edit-list__toggle")['on']("hover:enter",function(){
var _0x4cefbf=_0x4a1c08,_0x247266=_0x28a774['indexOf'](_0x284525);
_0x247266!==-0x1?(_0x28a774["splice"](_0x247266,0x1),_0x52c6e0["find"]('.dot')['attr']('opacity','0')):(_0x28a774["push"](_0x284525),_0x52c6e0["find"]('.dot')["attr"]("opacity",'1'));

}
),_0x479b89['append'](_0x52c6e0);

}
);
var _0x3aafed=$("<div class=\"selector folder-create-confirm\">            <div>Сохранить изменения</div>        </div>");
_0x3aafed['on']('hover:enter',function(){
var _0x20818f=_0x2df37c;
if(_0x28a774["length"]<0x1){
Lampa["Noty"]["show"]('Выберите\x20хотя\x20бы\x201\x20кнопку');
return;

}
var _0x900e55=_0x361162();
_0x900e55[_0x434688]=_0x28a774,_0xab48b7(_0x900e55),Lampa["Modal"]["close"](),Lampa["Noty"]['show']("Содержимое папки обновлено"),setTimeout(function(){
var _0x4d52f5=_0x20818f;
currentCard&&currentCard['length']&&currentCard[0x0]&&(applyButtonsLayout(currentCard),Lampa["Controller"]["toggle"]("content"));

}
,0xc8);

}
),_0x479b89["append"](_0x3aafed),Lampa["Modal"]["open"]({
'title':"Редактирование: "+_0x428f1c,'html':_0x479b89,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function(){
var _0x2a1ae6=_0x2df37c;
Lampa['Modal']["close"](),_0x23cc06(_0x434688);

}

}
);

}
function _0x266fce(_0x26ace9){
var _0x106e7e=_0x1e843c,_0x2dc46b=_0x361162(),_0x31a67d=_0x2dc46b[_0x26ace9]||[],_0x406e0a=$('<div\x20class=\x22menu-edit-list\x22></div>'),_0x47a241=[];
_0x31a67d["forEach"](function(_0x57982c){
var _0xc0bad8=_0x106e7e,_0x1aadef=_0x2ffe0a(_0x57982c);
_0x1aadef&&_0x47a241["push"](_0x1aadef);

}
);
var _0x537b82={

}
;
_0x47a241["forEach"](function(_0x2060c1){
var _0x3a278c=_0x106e7e,_0x3f8885=_0x2060c1["jquery"]?_0x2060c1:$(_0x2060c1),_0x38dcdc=_0x3f8885["find"]("span")["first"]()['text']()['trim']()||_0x3f8885['text']()["trim"]();
_0x38dcdc&&(_0x537b82[_0x38dcdc]=(_0x537b82[_0x38dcdc]||0x0)+0x1);

}
),_0x47a241["forEach"](function(_0x4ba433){
var _0x12253b=_0x106e7e,_0x1dddf7=_0x4ba433["jquery"]?_0x4ba433:$(_0x4ba433),_0xa8b821=_0x5510f6(_0x1dddf7),_0x293d04=_0x29cbe1(_0x1dddf7),_0x314658=_0x1dddf7["find"]("svg")['first'](),_0xd30be3=_0x314658["length"]?_0x314658["clone"]():$("<svg></svg>"),_0x13a07a=_0x1dddf7["find"]("span")['first']()["text"]()["trim"]()||_0x1dddf7["text"]()["trim"]();
if(_0x13a07a&&_0x537b82[_0x13a07a]>0x1){
var _0x3d8318=_0x1dddf7["attr"]('class')||'',_0x5eeca0=_0x1dddf7["attr"]("data-subtitle")||_0x1dddf7["attr"]("data-name")||_0x1dddf7["attr"]("data-id")||'';
if(_0x5eeca0){
var _0x4f3f5e=_0x5eeca0['split'](/\s+/)[0x0];
if(_0x4f3f5e["length"]>0x1e)_0x4f3f5e=_0x4f3f5e['substring'](0x0,0x1e);
_0x293d04=_0x13a07a+'\x20('+_0x4f3f5e+')';

}
else{
var _0x9717e6=_0x3d8318["match"](/(?:button--|view--)(\w+)/);
_0x9717e6&&_0x9717e6[0x1]&&(_0x293d04=_0x13a07a+'\x20('+_0x9717e6[0x1]+')');

}

}
var _0x2793ce=$("<div class=\"menu-edit-list__item\">"+"<div class=\"menu-edit-list__icon\"></div>"+"<div class=\"menu-edit-list__title\">"+_0x293d04+"</div>"+"<div class=\"menu-edit-list__move move-up selector\">"+"<svg width=\"22\" height=\"14\" viewBox=\"0 0 22 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"+"<path d=\"M2 12L11 3L20 12\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/>"+"</svg>"+"</div>"+"<div class=\"menu-edit-list__move move-down selector\">"+"<svg width=\"22\" height=\"14\" viewBox=\"0 0 22 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"+"<path d=\"M2 2L11 11L20 2\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/>"+"</svg>"+'</div>'+"</div>");
_0x2793ce["find"](".menu-edit-list__icon")["append"](_0xd30be3),_0x2793ce["data"]("btnId",_0xa8b821),_0x2793ce["find"](".move-up")['on']("hover:enter",function(){
var _0x559074=_0x12253b,_0x569111=_0x2793ce["prev"]();
_0x569111["length"]&&(_0x2793ce['insertBefore'](_0x569111),_0x2f6127(_0x26ace9,_0x406e0a));

}
),_0x2793ce['find'](".move-down")['on']("hover:enter",function(){
var _0x532687=_0x12253b,_0x37f1ef=_0x2793ce["next"]();
_0x37f1ef["length"]&&(_0x2793ce["insertAfter"](_0x37f1ef),_0x2f6127(_0x26ace9,_0x406e0a));

}
),_0x406e0a["append"](_0x2793ce);

}
);
var _0x297a99=_0x36b91b();
Lampa["Modal"]["open"]({
'title':_0x297a99[_0x26ace9]||"Папка",'html':_0x406e0a,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function(){
var _0x4386c1=_0x106e7e;
Lampa["Modal"]["close"](),_0x23cc06(_0x26ace9);

}

}
);

}
function _0x2f6127(_0x45edc7,_0x3e3af8){
var _0x55009d=_0x1e843c,_0x1c3708=[];
_0x3e3af8["find"](".menu-edit-list__item")['each'](function(){
var _0x1f0f11=_0x55009d,_0x2257ee=$(this)['data']("btnId");
_0x2257ee&&_0x1c3708["push"](_0x2257ee);

}
);
if(_0x1c3708["length"]>0x0){
var _0x5925ff=_0x361162();
_0x5925ff[_0x45edc7]=_0x1c3708,_0xab48b7(_0x5925ff);

}

}
function _0x3f96f1(){
var _0x2ea173=_0x1e843c,_0xea4fd8=Lampa['Storage']["get"](STORAGE_TITLES);
return _0xea4fd8&&typeof _0xea4fd8==="object"?_0xea4fd8:{

}
;

}
function _0x26e274(_0x43bba1,_0x1341de){
var _0x301ee3=_0x1e843c,_0x255f82=_0x3f96f1();
_0x255f82[_0x43bba1]=_0x1341de,Lampa['Storage']["set"](STORAGE_TITLES,_0x255f82);

}
function _0x15cbc9(){
var _0x196f58=_0x1e843c,_0xf8a106=Lampa["Storage"]['get'](STORAGE_ICONS);
return _0xf8a106&&typeof _0xf8a106==="object"?_0xf8a106:{

}
;

}
function _0x257793(_0x25b9bd,_0x2cbb4e){
var _0x226251=_0x1e843c,_0x551a4f=_0x15cbc9();
_0x551a4f[_0x25b9bd]=_0x2cbb4e,Lampa['Storage']["set"](STORAGE_ICONS,_0x551a4f);

}
function _0x40a28e(){
var _0x306ddc=_0x1e843c,_0x546d56=Lampa["Storage"]['get'](STORAGE_ORIGINAL_TITLES);
return _0x546d56&&typeof _0x546d56==="object"?_0x546d56:{

}
;

}
function _0x27cfe5(_0x3fcd28){
var _0x1b6011=_0x1e843c;
if(!_0x3fcd28||!_0x3fcd28['length']||!_0x3fcd28[0x0])return;
var _0x3dcbb3=_0x40a28e(),_0x138db6=![];
_0x3fcd28["find"](".full-start__button")["each"](function(){
var _0x331f30=_0x1b6011,_0x2fc93c=$(this);
if(_0x2fc93c["hasClass"]("button--folder"))return;
var _0x16b991=_0x5510f6(_0x2fc93c);
if(!_0x3dcbb3[_0x16b991]){
var _0x3c7947;
_0x16b991==="button--rating"?_0x3c7947="Оценить":_0x3c7947=_0x2fc93c["find"]("span")["first"]()["text"]()["trim"](),_0x3c7947&&(_0x3dcbb3[_0x16b991]=_0x3c7947,_0x138db6=!![]);

}

}
),_0x138db6&&Lampa["Storage"]["set"](STORAGE_ORIGINAL_TITLES,_0x3dcbb3);

}
function _0x416db3(_0x56eb7a){
var _0x51c38b=_0x1e843c;
if(!_0x56eb7a||!_0x56eb7a["length"]||!_0x56eb7a[0x0])return;
var _0x3da0ef=Lampa["Storage"]['get'](STORAGE_ORIGINAL_ICONS,{

}
),_0x1f6da6=![];
_0x56eb7a["find"](".full-start__button")["each"](function(){
var _0x2a3605=_0x51c38b,_0x5c7bcc=$(this),_0x1d8a2b=_0x5510f6(_0x5c7bcc);
if(!_0x3da0ef[_0x1d8a2b]){
var _0x46648a=_0x5c7bcc["find"]("svg")["first"]();
_0x46648a["length"]&&(_0x3da0ef[_0x1d8a2b]=_0x46648a["prop"]("outerHTML"),_0x1f6da6=!![]);

}

}
),_0x1f6da6&&Lampa["Storage"]["set"](STORAGE_ORIGINAL_ICONS,_0x3da0ef);

}
function _0x25c13f(_0x3f1b73){
var _0x43877f=_0x1e843c;
if(_0x3f1b73&&_0x3f1b73['body'])return _0x3f1b73["body"];
if(_0x3f1b73&&_0x3f1b73["link"]&&_0x3f1b73["link"]["html"])return _0x3f1b73["link"]["html"];
if(_0x3f1b73&&_0x3f1b73['object']&&_0x3f1b73["object"]["activity"]&&typeof _0x3f1b73["object"]["activity"]["render"]==="function")return _0x3f1b73['object']["activity"]["render"]();
return null;

}
function _0x5510f6(_0x49d404){
var _0x2301b1=_0x1e843c,_0x16f4e5=_0x49d404["attr"]("data-button-id");
if(_0x16f4e5)return _0x16f4e5;
if(_0x49d404["hasClass"]("shots-view-button"))return _0x16f4e5='shots-view-button',_0x49d404["attr"]('data-button-id',_0x16f4e5),_0x16f4e5;
var _0x24aa21=(_0x49d404["attr"]("class")||'')["split"](/\s+/),_0x9aa67d=null;
for(var _0x233380=0x0;
_0x233380<_0x24aa21["length"];
_0x233380++){
var _0x3dee5b=_0x24aa21[_0x233380];
if(_0x3dee5b["indexOf"]("button--")===0x0&&_0x3dee5b!=="button--priority"){
_0x9aa67d=_0x3dee5b;
break;

}

}
if(!_0x9aa67d)for(var _0x22e16d=0x0;
_0x22e16d<_0x24aa21["length"];
_0x22e16d++){
var _0x1e289a=_0x24aa21[_0x22e16d];
if(_0x1e289a["indexOf"]('view--')===0x0){
_0x9aa67d=_0x1e289a;
break;

}

}
if(_0x9aa67d){
if(_0x9aa67d==="button--rating")return _0x49d404["attr"]("data-button-id",'button--rating'),'button--rating';
var _0x154392=_0x49d404['attr']("data-subtitle")||'',_0x4560a3=_0x49d404["attr"]("data-name")||'',_0x43b05a=_0x154392||_0x4560a3||'';
if(_0x43b05a)return _0x16f4e5=_0x9aa67d+'_'+Lampa["Utils"]["hash"](_0x43b05a),_0x49d404["attr"]("data-button-id",_0x16f4e5),_0x16f4e5;
var _0x24c842=_0x49d404["clone"]();
_0x24c842["find"](".focus")["removeClass"]('focus'),_0x24c842["find"]('svg')["remove"](),_0x24c842['find']("span")["remove"]();
var _0x14988e=Lampa["Utils"]['hash'](_0x24c842["html"]());
return _0x16f4e5=_0x9aa67d+'_'+_0x14988e,_0x49d404["attr"]("data-button-id",_0x16f4e5),_0x16f4e5;

}
var _0x2ea069=_0x49d404["data"]('id')||_0x49d404['data']('name')||_0x49d404["attr"]('data-name');
if(_0x2ea069)return _0x16f4e5="data:"+_0x2ea069,_0x49d404['attr']("data-button-id",_0x16f4e5),_0x16f4e5;
var _0x7f096e=_0x49d404["text"]()["trim"]();
if(_0x7f096e)return _0x16f4e5="text:"+_0x7f096e,_0x49d404['attr']("data-button-id",_0x16f4e5),_0x16f4e5;
return _0x16f4e5="html:"+Lampa["Utils"]["hash"](_0x49d404["clone"]()["removeClass"]("focus")["prop"]("outerHTML")),_0x49d404["attr"]('data-button-id',_0x16f4e5),_0x16f4e5;

}
function _0x7adc64(_0x1af7a1){
var _0x2ef747=_0x1e843c;
if(defaultTitles[_0x1af7a1])return defaultTitles[_0x1af7a1]();
var _0x5231bc=_0x1af7a1['split']('_')[0x0];
if(defaultTitles[_0x5231bc])return defaultTitles[_0x5231bc]();
if(_0x1af7a1["indexOf"]('_')!==-0x1){
var _0x59c35d=_0x1af7a1["split"]('_');
if(_0x59c35d["length"]>=0x2){
var _0x3ebeba=_0x59c35d[0x0]+'_'+_0x59c35d[0x1];
if(defaultTitles[_0x3ebeba])return defaultTitles[_0x3ebeba]();

}

}
return null;

}
function _0x4d023d(_0x4d00fa,_0x481ad7){
var _0x15c305=_0x1e843c,_0x2e5553=_0x3f96f1();
if(_0x2e5553[_0x4d00fa])return _0x2e5553[_0x4d00fa];
var _0x5a1327=_0x481ad7["find"]("span")["first"]()["text"]()["trim"]()||_0x481ad7['text']()["trim"]();
if(_0x5a1327)return _0x5a1327;
var _0x28a0d9=_0x7adc64(_0x4d00fa);
if(_0x28a0d9)return _0x28a0d9;
return _0x4d00fa;

}
function _0x5241dd(_0x4c6e26){
var _0x31c0de=_0x1e843c;
if(!_0x4c6e26||!_0x4c6e26["length"])return null;
var _0x14ee38=_0x4c6e26['find']('.full-start__button.focus');
if(_0x14ee38&&_0x14ee38["length"])return _0x5510f6(_0x14ee38);
return null;

}
function _0x24b705(_0x557938,_0x10e03e){
var _0x27266f=_0x1e843c;
if(!_0x557938||!_0x557938["length"]||!_0x557938[0x0]||!_0x10e03e)return![];
var _0x4ef140=_0x557938["find"](".full-start__button")["filter"](function(){
return _0x5510f6($(this))===_0x10e03e;

}
)["first"]();
if(_0x4ef140&&_0x4ef140['length']&&!_0x4ef140["hasClass"]("button-hide")&&!_0x4ef140['hasClass']('hide'))try{
return Lampa["Controller"]["collectionFocus"](_0x4ef140[0x0],_0x557938[0x0]),!![];

}
catch(_0x1c7486){

}
return![];

}
function _0x11f56e(_0x3f58f5,_0x571828,_0x4611d5){
var _0x478db9=_0x1e843c;
if(!_0x4611d5||!_0x4611d5["length"]||!_0x4611d5[0x0])return;
var _0x25c0f1=_0x4611d5["find"](".full-start__button")["filter"](function(){
return _0x5510f6($(this))===_0x3f58f5;

}
)['first']();
if(_0x25c0f1&&_0x25c0f1['length']){
var _0x2f6928=_0x25c0f1["find"]("span")["first"]();
_0x2f6928['length']?_0x2f6928["text"](_0x571828):_0x25c0f1["contents"]()["filter"](function(){
var _0x41b27f=_0x478db9;
return this["nodeType"]===0x3;

}
)["first"]()["replaceWith"](_0x571828),_0x25c0f1['attr']("data-original-title",_0x571828);

}

}
function _0xa83fca(_0x117fbd,_0x824ac2,_0x3e7f32){
var _0x1e7920=_0x1e843c;
if(!_0x3e7f32||!_0x3e7f32["length"]||!_0x3e7f32[0x0])return;
var _0x4fc994=_0x3e7f32["find"](".full-start__button")['filter'](function(){
return _0x5510f6($(this))===_0x117fbd;

}
)["first"]();
if(_0x4fc994&&_0x4fc994["length"]){
var _0x576061=_0x4fc994['find']("svg")["first"]();
if(_0x576061["length"]&&_0x824ac2){
var _0x2de9a0=$(_0x824ac2);
_0x576061["replaceWith"](_0x2de9a0);

}

}

}
function _0x20899e(_0x530a75){
var _0x5dfa6c=_0x1e843c;
if(!_0x530a75||!_0x530a75["length"]||!_0x530a75[0x0])return;
var _0x37d157=_0x15cbc9(),_0x145315=Lampa["Storage"]["get"](STORAGE_ORIGINAL_ICONS,{

}
),_0x5d7744={

}
;
Object["keys"](_0x145315)['forEach'](function(_0xe09425){
var _0x2c102d=_0x5dfa6c,_0xcfad0a=_0xe09425["split"]('_')[0x0];
if(!_0x5d7744[_0xcfad0a])_0x5d7744[_0xcfad0a]=[];
_0x5d7744[_0xcfad0a]["push"](_0x145315[_0xe09425]);

}
);
var _0x469222={

}
;
_0x530a75['find'](".full-start__button")["each"](function(){
var _0x53d0f6=_0x5dfa6c,_0x1bf881=$(this);
if(_0x1bf881['hasClass']("button--folder"))return;
var _0x5a3dd3=_0x5510f6(_0x1bf881);
if(_0x37d157[_0x5a3dd3]){
var _0x212697=_0x1bf881['find']("svg")["first"]();
if(_0x212697["length"]){
var _0x1429e9=$(_0x37d157[_0x5a3dd3]);
_0x212697["replaceWith"](_0x1429e9);

}
return;

}
if(_0x145315[_0x5a3dd3]){
var _0x212697=_0x1bf881['find']('svg')["first"]();
if(_0x212697["length"]&&_0x212697["prop"]("outerHTML")!==_0x145315[_0x5a3dd3]){
var _0x1429e9=$(_0x145315[_0x5a3dd3]);
_0x212697["replaceWith"](_0x1429e9);

}
return;

}
var _0x1758b9=_0x5a3dd3["split"]('_')[0x0];
if(_0x5d7744[_0x1758b9]){
if(!_0x469222[_0x1758b9])_0x469222[_0x1758b9]=0x0;
var _0x4aae0e=_0x469222[_0x1758b9];
if(_0x4aae0e<_0x5d7744[_0x1758b9]["length"]){
var _0x45321b=_0x5d7744[_0x1758b9][_0x4aae0e];
_0x469222[_0x1758b9]++;
var _0x212697=_0x1bf881['find']("svg")["first"]();
if(_0x212697['length']&&_0x212697["prop"]("outerHTML")!==_0x45321b){
var _0x1429e9=$(_0x45321b);
_0x212697["replaceWith"](_0x1429e9);

}

}

}

}
);

}
function _0x2210a3(_0x1f2091,_0x35d528){
var _0x3d5a14=_0x1e843c;
if(!_0x1f2091||!_0x1f2091["length"]||!_0x1f2091[0x0])return{
'items':[],'map':{

}
,'targetContainer':$(),'extraContainer':$()
}
;
var _0x379d3a=_0x1f2091["find"](".full-start-new__buttons"),_0x2b42d4=_0x1f2091['find']('.buttons--container'),_0x5e44ec=[],_0x35e758={

}
;
function _0x2f9d0a(_0x40639d){
var _0x45b0d3=_0x3d5a14;
_0x40639d["each"](function(){
var _0x3786a2=_0x45b0d3,_0x3d14b4=$(this);
if(_0x3d14b4["hasClass"]('button--play')||_0x3d14b4["hasClass"]("button--priority"))return;
if(_0x3d14b4['hasClass']("hide"))return;
if(_0x3d14b4["hasClass"]("button--folder"))return;
var _0x3bda4e=_0x5510f6(_0x3d14b4);
if(!_0x3bda4e)return;
_0x3d14b4["hasClass"]('button--options')&&!_0x3d14b4['find']("span")["length"]&&_0x3d14b4['append']('<span>Ещё</span>');
if(_0x35e758[_0x3bda4e]){
var _0x3193ea=0x1,_0x458568=_0x3bda4e+'_'+_0x3193ea;
while(_0x35e758[_0x458568]){
_0x3193ea++,_0x458568=_0x3bda4e+'_'+_0x3193ea;

}
_0x3bda4e=_0x458568;

}
_0x35e758[_0x3bda4e]=_0x35d528?_0x3d14b4["detach"]():_0x3d14b4,_0x5e44ec["push"](_0x3bda4e);

}
);

}
if(_0x379d3a["length"])_0x2f9d0a(_0x379d3a["find"](".full-start__button"));
if(_0x2b42d4['length'])_0x2f9d0a(_0x2b42d4["find"](".full-start__button"));
return{
'items':_0x5e44ec,'map':_0x35e758,'targetContainer':_0x379d3a,'extraContainer':_0x2b42d4
}
;

}
function _0x51d206(_0x930d32,_0x13e618){
var _0x37b7a0=_0x1e843c,_0x358a33=[],_0x1b340a=new Set(_0x13e618);
_0x930d32["forEach"](function(_0x130525){
var _0x1126d5=_0x37b7a0;
if(_0x1b340a["has"](_0x130525))_0x358a33['push'](_0x130525);

}
);
var _0x288882=[];
_0x13e618["forEach"](function(_0x9b4a00){
var _0x3de81a=_0x37b7a0;
if(!_0x358a33["includes"](_0x9b4a00))_0x288882['push'](_0x9b4a00);

}
);
if(!_0x930d32||_0x930d32["length"]===0x0){
var _0x402850=["view--torrent","view--trailer",'shots-view-button','button--book','button--reaction','button--options',"button--rating"];
_0x288882["sort"](function(_0x5d2992,_0x9e830d){
var _0x300259=_0x37b7a0,_0x5463c2=_0x5d2992["split"]('_')[0x0],_0x5247bf=_0x9e830d['split']('_')[0x0],_0x3f4e13=_0x402850["indexOf"](_0x5463c2),_0x2b42c1=_0x402850['indexOf'](_0x5247bf);
if(_0x5d2992==="shots-view-button")_0x3f4e13=_0x402850["indexOf"]("shots-view-button");
if(_0x9e830d==="shots-view-button")_0x2b42c1=_0x402850["indexOf"]("shots-view-button");
if(_0x3f4e13!==-0x1&&_0x2b42c1!==-0x1)return _0x3f4e13-_0x2b42c1;
if(_0x3f4e13!==-0x1)return 0x1;
if(_0x2b42c1!==-0x1)return-0x1;
if(_0x5463c2<_0x5247bf)return-0x1;
if(_0x5463c2>_0x5247bf)return 0x1;
return 0x0;

}
);

}
return _0x288882["forEach"](function(_0x221d0f){
_0x358a33['push'](_0x221d0f);

}
),_0x358a33;

}
function _0x40e8da(_0x218238){
var _0x1517ac=_0x1e843c,_0x5e0dcd=new Set(_0x2e6676(STORAGE_HIDE));
Object["keys"](_0x218238)["forEach"](function(_0x3efa39){
var _0x19d18e=_0x1517ac;
if(_0x218238[_0x3efa39])_0x218238[_0x3efa39]["toggleClass"]('button-hide',_0x5e0dcd["has"](_0x3efa39));

}
);

}
function _0xa34d09(_0x3bbd37){
var _0x388d4b=_0x1e843c;
if(!_0x3bbd37||!_0x3bbd37['length']||!_0x3bbd37[0x0])return;
var _0x17cbdb=_0x3f96f1(),_0x679966=_0x40a28e();
_0x3bbd37['find'](".full-start__button")['each'](function(){
var _0x4fc5f8=_0x388d4b,_0x2ff369=$(this);
if(_0x2ff369['hasClass']("button--folder"))return;
var _0x2442bc=_0x5510f6(_0x2ff369);
if(_0x17cbdb[_0x2442bc]){
var _0x592d3b=_0x2ff369["find"]("span")["first"]();
_0x592d3b["length"]?_0x592d3b["text"](_0x17cbdb[_0x2442bc]):_0x2ff369["contents"]()["filter"](function(){
return this['nodeType']===0x3;

}
)["first"]()["replaceWith"](_0x17cbdb[_0x2442bc]);

}
else{
if(_0x679966[_0x2442bc]){
var _0x592d3b=_0x2ff369['find']("span")["first"]();
_0x592d3b['length']&&_0x592d3b["text"]()['trim']()!==_0x679966[_0x2442bc]&&_0x592d3b["text"](_0x679966[_0x2442bc]);

}

}

}
);

}
function _0x1fb766(_0x3da1a5){
var _0x34353f=_0x1e843c;
if(!_0x3da1a5||!_0x3da1a5["length"]||!_0x3da1a5[0x0])return;
var _0x359b70=Lampa["Storage"]['get'](STORAGE_SHOW_NAMES);
if(_0x359b70===null)_0x359b70=!![];
var _0x2865a4=_0x3da1a5["find"](".full-start-new__buttons");
if(!_0x2865a4["length"])return;
_0x2865a4['find']('.button--options')["each"](function(){
var _0x4beb02=_0x34353f,_0x1c79aa=$(this);
if(!_0x1c79aa["find"]("span")["length"])_0x1c79aa["append"]('<span>Ещё</span>');

}
),_0x359b70?_0x2865a4["find"](".full-start__button")["each"](function(){
var _0x2dfe04=_0x34353f,_0x3a80b8=$(this),_0x4c5770=_0x3a80b8["find"]("span");
if(_0x4c5770["length"])_0x4c5770['css']("display","inline");

}
):_0x2865a4["find"]('.full-start__button')["each"](function(){
var _0x1e0ba7=_0x34353f,_0x586d90=$(this),_0x30b8db=_0x586d90["find"]("span");
if(_0x30b8db["length"])_0x30b8db["css"]("display",'');

}
);

}
function applyButtonsLayout(_0x590135,_0x2d6b9e){
var _0xb58a03=_0x1e843c;
if(!_0x590135||!_0x590135["length"]||!_0x590135[0x0])return;
_0x3868cb();
var _0x3ec156=_0x590135["find"]('.full-start-new__buttons');
if(!_0x3ec156["length"])return;
_0x27cfe5(_0x590135),_0x416db3(_0x590135);
!_0x2d6b9e&&_0x3ec156["find"]('.button--folder')['remove']();
var _0x2de9e6=_0x3ec156["find"](".button--priority")["detach"](),_0x82edf8=_0x2210a3(_0x590135,!![]),_0x111545=_0x82edf8['items'],_0x52311d=_0x82edf8["map"],_0x916698=_0x4bb9bd(),_0x3c987d=_0x361162(),_0x57da1e=_0x5a9894(),_0x47c712=_0x12f927(),_0x5f50e2=_0x51d206(_0x2e6676(STORAGE_ORDER),_0x111545);
_0x3ec156['empty']();
_0x2de9e6['length']&&_0x3ec156['append'](_0x2de9e6);
var _0x39fc93={

}
,_0x4e0480=[];
_0x47c712['length']>0x0&&_0x47c712["forEach"](function(_0x252bf2){
var _0xc0d9aa=_0xb58a03;
if(_0x252bf2["type"]==="folder"&&!_0x39fc93[_0x252bf2['id']]){
var _0x382372=_0xbe6507(_0x252bf2['id']);
_0x382372["length"]&&(_0x57da1e['indexOf'](_0x252bf2['id'])!==-0x1&&_0x382372["addClass"]('folder-hidden'),_0x3ec156["append"](_0x382372),_0x39fc93[_0x252bf2['id']]=!![]);

}
else{
if(_0x252bf2['type']==="button"&&!_0x39fc93[_0x252bf2['id']]){
var _0xdcc6c7=_0x252bf2['id'];
_0x52311d[_0xdcc6c7]&&_0x52311d[_0xdcc6c7]['length']&&(_0x916698["includes"](_0xdcc6c7)?_0x52311d[_0xdcc6c7]['attr']("style","display: none !important"):_0x52311d[_0xdcc6c7]['attr']('style',''),_0x3ec156["append"](_0x52311d[_0xdcc6c7]),_0x39fc93[_0xdcc6c7]=!![]);

}

}

}
),Object["keys"](_0x3c987d)["forEach"](function(_0x186adb){
var _0x552c33=_0xb58a03;
!_0x39fc93[_0x186adb]&&_0x4e0480["push"](_0x186adb);

}
),_0x4e0480["forEach"](function(_0x33ddd2){
var _0x2f39b9=_0xb58a03,_0x519d3d=_0xbe6507(_0x33ddd2);
if(_0x519d3d["length"]){
_0x57da1e["indexOf"](_0x33ddd2)!==-0x1&&_0x519d3d["addClass"]("folder-hidden");
var _0x56c294=_0x3ec156["children"]()['first']();
_0x56c294['length']?_0x519d3d["insertBefore"](_0x56c294):_0x3ec156['append'](_0x519d3d),_0x39fc93[_0x33ddd2]=!![];

}

}
),_0x5f50e2['forEach'](function(_0x11eb24){
var _0x5c0ed5=_0xb58a03;
!_0x39fc93[_0x11eb24]&&_0x52311d[_0x11eb24]&&_0x52311d[_0x11eb24]['length']&&(_0x916698["includes"](_0x11eb24)?_0x52311d[_0x11eb24]['attr']('style',"display: none !important"):_0x52311d[_0x11eb24]["attr"]("style",''),_0x3ec156["append"](_0x52311d[_0x11eb24]),_0x39fc93[_0x11eb24]=!![]);

}
),buttonList=[],_0x5f50e2['forEach'](function(_0x1e1975){
var _0x27b234=_0xb58a03;
_0x52311d[_0x1e1975]&&_0x52311d[_0x1e1975]["length"]&&buttonList["push"](_0x52311d[_0x1e1975]);

}
),_0x40e8da(_0x52311d),_0x20899e(_0x590135),_0xa34d09(_0x590135),_0x1fb766(_0x590135),!_0x2d6b9e&&setTimeout(function(){
_0x20899e(_0x590135),_0xa34d09(_0x590135),_0x1fb766(_0x590135);

}
,0xc8),Lampa["Controller"]["toggle"]('content');

}
function _0x2d9bca(_0x79e05c,_0x65037e,_0x20db02){
var _0x2fb547=_0x1e843c,_0x33f48d=$("<div class=\"icon-picker-list\"></div>"),_0x81e299=$("<div class=\"icon-reset-button selector\">По умолчанию</div>");
_0x81e299['on']("hover:enter",function(){
var _0x4344e3=_0x2fb547;
Lampa["Modal"]['close']();
var _0x396632=_0x15cbc9();
delete _0x396632[_0x79e05c],Lampa["Storage"]["set"](STORAGE_ICONS,_0x396632);
var _0x52be9a=Lampa["Storage"]["get"](STORAGE_ORIGINAL_ICONS,{

}
);
_0x52be9a[_0x79e05c]&&_0xa83fca(_0x79e05c,_0x52be9a[_0x79e05c],_0x65037e);
if(_0x20db02)_0x20db02();

}
),_0x33f48d["append"](_0x81e299),iconPresets["forEach"](function(_0x2f6aa6){
var _0x5d7b90=_0x2fb547,_0x305664=$('<div\x20class=\x22icon-picker-item\x20selector\x22><div\x20class=\x22icon-picker-icon\x22>'+_0x2f6aa6['svg']+'</div></div>');
_0x305664['on']("hover:enter",function(){
var _0x3fbcbb=_0x5d7b90;
Lampa['Modal']["close"](),_0x257793(_0x79e05c,_0x2f6aa6["svg"]);
if(_0x20db02)_0x20db02();

}
),_0x33f48d["append"](_0x305664);

}
),Lampa["Modal"]["open"]({
'title':"Выберите иконку",'html':_0x33f48d,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function(){
var _0x6d54ab=_0x2fb547;
Lampa["Modal"]['close']();
if(_0x20db02)_0x20db02();

}

}
);

}
function _0x1892fd(_0x19a173,_0x183543){
var _0x3aae1d=_0x1e843c,_0x48add6=$("<div class=\"icon-picker-list\"></div>"),_0x21c006=$("<div class=\"icon-reset-button selector\">По умолчанию</div>");
_0x21c006['on']("hover:enter",function(){
var _0x5f40e7=_0x3aae1d;
Lampa["Modal"]["close"](),_0x763ec(_0x19a173,defaultFolderIcon),Lampa['Noty']["show"]("Иконка сброшена"),setTimeout(function(){
_0x183543&&_0x183543['length']&&_0x183543[0x0]&&openEditorMenu(_0x183543,_0x1036a9,_0x254f19);

}
,0x64);

}
),_0x48add6["append"](_0x21c006),iconPresets["forEach"](function(_0xa3e6d4){
var _0x36e4d5=_0x3aae1d,_0x281ef5=$("<div class=\"icon-picker-item selector\"><div class=\"icon-picker-icon\">"+_0xa3e6d4["svg"]+"</div></div>");
_0x281ef5['on']('hover:enter',function(){
var _0x41f1b7=_0x36e4d5;
Lampa["Modal"]['close'](),_0x763ec(_0x19a173,_0xa3e6d4["svg"]),Lampa["Noty"]["show"]('Иконка\x20изменена'),setTimeout(function(){
var _0x3422fa=_0x41f1b7;
_0x183543&&_0x183543["length"]&&_0x183543[0x0]&&openEditorMenu(_0x183543,_0x1036a9,_0x254f19);

}
,0x64);

}
),_0x48add6["append"](_0x281ef5);

}
),Lampa["Modal"]["open"]({
'title':"Выберите иконку для папки",'html':_0x48add6,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function(){
var _0x368219=_0x3aae1d;
Lampa["Modal"]['close'](),setTimeout(function(){
var _0x31fc1e=_0x368219;
_0x183543&&_0x183543["length"]&&_0x183543[0x0]&&openEditorMenu(_0x183543,_0x1036a9,_0x254f19);

}
,0x64);

}

}
);

}
function _0x169143(_0x3d9fca,_0x3a34f7,_0x3448b3,_0xa5bbfb,_0x2920c4,_0x232bcd,_0x540ffd){
var _0x20f865=_0x1e843c;
Lampa['Modal']['close'](),Lampa["Input"]["edit"]({
'free':!![],'title':"Изменить название кнопки",'nosave':!![],'value':_0x3a34f7,'onBack':function(){
setTimeout(function(){
var _0x2a0f6a=_0x2bca;
_0x3448b3&&_0x3448b3["length"]&&_0x3448b3[0x0]&&openEditorMenu(_0x3448b3,_0x3d9fca,_0x232bcd);

}
,0xc8);

}

}
,function(_0x13cc54){
var _0x341f2d=_0x20f865;
if(_0x13cc54&&_0x13cc54["trim"]()){
var _0x5ad971=_0x13cc54["trim"]();
_0x26e274(_0x3d9fca,_0x5ad971),_0x11f56e(_0x3d9fca,_0x5ad971,_0x3448b3),Lampa["Noty"]["show"]("Название кнопки изменено"),setTimeout(function(){
var _0x5a4d58=_0x341f2d;
_0x3448b3&&_0x3448b3["length"]&&_0x3448b3[0x0]&&openEditorMenu(_0x3448b3,_0x3d9fca,_0x232bcd);

}
,0xc8);

}
else Lampa["Noty"]["show"]("Название не может быть пустым"),setTimeout(function(){
_0x3448b3&&_0x3448b3['length']&&_0x3448b3[0x0]&&openEditorMenu(_0x3448b3,_0x3d9fca,_0x232bcd);

}
,0xc8);

}
);

}
function _0x21a29e(_0x3bd41e,_0xbfadae,_0x2323e8){
var _0x412987=_0x1e843c;
Lampa["Modal"]["close"](),Lampa["Input"]["edit"]({
'free':!![],'title':'Изменить\x20название\x20папки','nosave':!![],'value':_0xbfadae,'onBack':function(){
setTimeout(function(){
_0x2323e8&&_0x2323e8['length']&&_0x2323e8[0x0]&&openEditorMenu(_0x2323e8,_0x3bd41e,_0x254f19);

}
,0xc8);

}

}
,function(_0x2be3f8){
var _0x5ec834=_0x412987;
if(_0x2be3f8&&_0x2be3f8["trim"]()){
var _0x47e344=_0x2be3f8["trim"]();
_0x586ca3(_0x3bd41e,_0x47e344),Lampa["Noty"]["show"]('Название\x20папки\x20изменено'),setTimeout(function(){
var _0x15ed4e=_0x5ec834;
_0x2323e8&&_0x2323e8["length"]&&_0x2323e8[0x0]&&openEditorMenu(_0x2323e8,_0x3bd41e,_0x254f19);

}
,0xc8);

}
else Lampa['Noty']["show"]('Название\x20не\x20может\x20быть\x20пустым'),setTimeout(function(){
var _0x759fad=_0x5ec834;
_0x2323e8&&_0x2323e8["length"]&&_0x2323e8[0x0]&&openEditorMenu(_0x2323e8,_0x3bd41e,_0x254f19);

}
,0xc8);

}
);

}
function _0x237b2b(){
var _0x307aad=_0x1e843c;
Lampa["Input"]["edit"]({
'free':!![],'title':"Название папки",'nosave':!![],'value':'','nomic':!![]
}
,function(_0x11df3a){
var _0x28a67d=_0x307aad;
if(!_0x11df3a||!_0x11df3a['trim']()){
Lampa["Noty"]['show']("Введите название папки"),openEditorMenu(currentCard,_0x1036a9,_0x254f19);
return;

}
_0x5bc8c6(_0x11df3a["trim"]());

}
);

}
function _0x5bc8c6(_0x1e5962){
var _0x3087a4=_0x1e843c,_0x351d01=$("<div class=\"icon-picker-list\"></div>");
iconPresets["forEach"](function(_0x1b5ccc){
var _0x4c4305=_0x3087a4,_0x111b00=$("<div class=\"icon-picker-item selector\">                <div class=\"icon-picker-icon\">"+_0x1b5ccc['svg']+"</div>            </div>");
_0x111b00['on']('hover:enter',function(){
var _0x388ac3=_0x4c4305;
Lampa['Modal']["close"](),_0x2af7ca(_0x1e5962,_0x1b5ccc["svg"]);

}
),_0x351d01["append"](_0x111b00);

}
),Lampa["Modal"]["open"]({
'title':"Выберите иконку для папки",'html':_0x351d01,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function(){
var _0xbf6f3e=_0x3087a4;
Lampa["Modal"]["close"](),_0x237b2b();

}

}
);

}
function _0x2af7ca(_0x4596ff,_0x52250f){
var _0x7a3213=_0x1e843c,_0x45c613=[],_0x3da14e=$("<div class=\"menu-edit-list\"></div>"),_0x4cce40=_0x4bb9bd(),_0x4fa1b4=[];
buttonList['forEach'](function(_0x3d23cc){
var _0x14e999=_0x7a3213,_0x2bf5f0=_0x5510f6(_0x3d23cc);
_0x4cce40["indexOf"](_0x2bf5f0)===-0x1&&_0x4fa1b4["push"](_0x3d23cc);

}
);
var _0x7411b9={

}
;
_0x4fa1b4["forEach"](function(_0x3b37d6){
var _0x5af1d9=_0x7a3213,_0x26b2f7=_0x3b37d6['find']("span")["first"]()['text']()["trim"]()||_0x3b37d6['text']()["trim"]();
_0x26b2f7&&(_0x7411b9[_0x26b2f7]=(_0x7411b9[_0x26b2f7]||0x0)+0x1);

}
),_0x4fa1b4['forEach'](function(_0x5c442f){
var _0x12b600=_0x7a3213,_0x42ae4f=_0x5510f6(_0x5c442f),_0x5549b9=_0x29cbe1(_0x5c442f),_0x16a554=_0x5c442f['find']("svg")["first"](),_0x1552e8=_0x16a554['length']?_0x16a554["clone"]():$("<svg></svg>"),_0x50c236=_0x5c442f["find"]("span")["first"]()["text"]()["trim"]()||_0x5c442f['text']()["trim"]();
if(_0x50c236&&_0x7411b9[_0x50c236]>0x1){
var _0x4aa40c=_0x5c442f['attr']("class")||'',_0x5c66d7=_0x5c442f["attr"]('data-subtitle')||_0x5c442f["attr"]("data-name")||_0x5c442f["attr"]('data-id')||'';
if(_0x5c66d7){
var _0x14585f=_0x5c66d7["split"](/\s+/)[0x0];
if(_0x14585f['length']>0x1e)_0x14585f=_0x14585f['substring'](0x0,0x1e);
_0x5549b9=_0x50c236+'\x20('+_0x14585f+')';

}
else{
var _0x363837=_0x4aa40c["match"](/(?:button--|view--)(\w+)/);
_0x363837&&_0x363837[0x1]&&(_0x5549b9=_0x50c236+'\x20('+_0x363837[0x1]+')');

}

}
var _0x36246f=$("<div class=\"menu-edit-list__item\">                <div class=\"menu-edit-list__icon\"></div>                <div class=\"menu-edit-list__title\">"+_0x5549b9+"</div>                <div class=\"menu-edit-list__toggle selector\">                    <svg width=\"26\" height=\"26\" viewBox=\"0 0 26 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                        <rect x=\"1.89111\" y=\"1.78369\" width=\"21.793\" height=\"21.793\" rx=\"3.5\" stroke=\"currentColor\" stroke-width=\"3\"/>                        <path d=\"M7.44873 12.9658L10.8179 16.3349L18.1269 9.02588\" stroke=\"currentColor\" stroke-width=\"3\" class=\"dot\" opacity=\"0\" stroke-linecap=\"round\"/>                    </svg>                </div>            </div>");
_0x36246f["find"]('.menu-edit-list__icon')["append"](_0x1552e8),_0x36246f["find"](".menu-edit-list__toggle")['on']("hover:enter",function(){
var _0x37cc03=_0x12b600,_0x555991=_0x45c613['indexOf'](_0x42ae4f);
_0x555991!==-0x1?(_0x45c613["splice"](_0x555991,0x1),_0x36246f["find"](".dot")["attr"]('opacity','0')):(_0x45c613["push"](_0x42ae4f),_0x36246f["find"](".dot")["attr"]("opacity",'1'));

}
),_0x3da14e["append"](_0x36246f);

}
);
var _0x7b1dbc=$("<div class=\"selector folder-create-confirm\">            <div>Создать папку \""+_0x4596ff+'\x22</div>\x20\x20\x20\x20\x20\x20\x20\x20</div>');
_0x7b1dbc['on']("hover:enter",function(){
var _0x5dfc04=_0x7a3213;
if(_0x45c613["length"]<0x1){
Lampa["Noty"]['show']("Выберите минимум 1 кнопку");
return;

}
var _0x2c05ea="folder_"+Date["now"]()+'_'+Math["floor"](Math["random"]()*0x2710);
_0x586ca3(_0x2c05ea,_0x4596ff),_0x763ec(_0x2c05ea,_0x52250f);
var _0x317e87=_0x361162();
_0x317e87[_0x2c05ea]=_0x45c613,_0xab48b7(_0x317e87),Lampa["Modal"]["close"](),Lampa["Noty"]["show"]("Папка \""+_0x4596ff+"\" создана"),setTimeout(function(){
var _0x4fe466=_0x5dfc04;
currentCard&&currentCard['length']&&currentCard[0x0]&&(applyButtonsLayout(currentCard),Lampa['Controller']["toggle"]("content"));

}
,0xc8);

}
),_0x3da14e["append"](_0x7b1dbc),Lampa["Modal"]['open']({
'title':"Выберите кнопки для папки",'html':_0x3da14e,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function(){
var _0x15208f=_0x7a3213;
Lampa["Modal"]['close'](),_0x5bc8c6(_0x4596ff);

}

}
);

}
function openEditorMenu(_0x3ccb5a,_0x54f158,_0x177583){
var _0x178506=_0x1e843c;
if(!_0x3ccb5a||!_0x3ccb5a["length"]||!_0x3ccb5a[0x0])return;
if(_0x177583)_0x254f19=_0x177583;
else{
var _0x186d8b=Lampa["Controller"]['enabled']();
_0x254f19=_0x186d8b?_0x186d8b["name"]:'content';

}
!_0x54f158?_0x1036a9=_0x5241dd(_0x3ccb5a):_0x1036a9=_0x54f158;
var _0x427fab=_0x2210a3(_0x3ccb5a,![]),_0x122fb8=_0x427fab["items"],_0x19c5f6=_0x427fab['map'],_0x1d9044=_0x51d206(_0x2e6676(STORAGE_ORDER),_0x122fb8),_0x4b2042=new Set(_0x2e6676(STORAGE_HIDE)),_0x26c062=_0x361162(),_0x1325d5=_0x4bb9bd(),_0x5bcd03=_0x36b91b(),_0x78c958=_0x2a8e21(),_0x91e596=_0x5a9894(),_0x1b86b3=_0x12f927(),_0x1cf93c=Lampa["Storage"]["get"](STORAGE_SHOW_NAMES);
if(_0x1cf93c===null)_0x1cf93c=!![];
var _0x50619c=$("<div class=\"menu-edit-list\"></div>"),_0xe6372b=$("<div class=\"menu-edit-list__item menu-edit-list__create-folder selector\">"+'<div\x20class=\x22menu-edit-list__icon\x22>'+"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\">"+"<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path>"+'<line\x20x1=\x2212\x22\x20y1=\x2211\x22\x20x2=\x2212\x22\x20y2=\x2217\x22></line>'+"<line x1=\"9\" y1=\"14\" x2=\"15\" y2=\"14\"></line>"+"</svg>"+'</div>'+"<div class=\"menu-edit-list__title\">Создать папку</div>"+"</div>");
_0xe6372b['on']("hover:enter",function(){
Lampa['Modal']['close'](),_0x237b2b();

}
),_0x50619c['append'](_0xe6372b);
var _0x466746=_0x1cf93c?0x1:0x0,_0x286435=$("<div class=\"menu-edit-list__item\" data-id=\"show_names\">            <div class=\"menu-edit-list__icon\">                <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                    <path d=\"M3 12H21M3 6H21M3 18H21\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/>                </svg>            </div>            <div class=\"menu-edit-list__title\">Названия кнопок</div>            <div class=\"menu-edit-list__toggle toggle selector\">                <svg width=\"26\" height=\"26\" viewBox=\"0 0 26 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                    <rect x=\"1.89111\" y=\"1.78369\" width=\"21.793\" height=\"21.793\" rx=\"3.5\" stroke=\"currentColor\" stroke-width=\"3\"/>                    <path d=\"M7.44873 12.9658L10.8179 16.3349L18.1269 9.02588\" stroke=\"currentColor\" stroke-width=\"3\" class=\"dot\" opacity=\""+_0x466746+"\" stroke-linecap=\"round\"/>                </svg>            </div>        </div>");
if(!_0x1cf93c)_0x286435["addClass"]("button-hidden");
_0x286435['find'](".toggle")['on']("hover:enter",function(){
var _0x5e5811=_0x178506;
_0x286435['toggleClass']('button-hidden');
var _0x2bab17=_0x286435["find"](".dot");
_0x2bab17["attr"]("opacity",_0x286435["hasClass"]('button-hidden')?0x0:0x1);

}
),_0x50619c['append'](_0x286435),_0x50619c["append"]("<div class=\"menu-edit-split\"></div>");
var _0x4b7430={

}
;
_0x1d9044['forEach'](function(_0x109fb7){
var _0x3221a2=_0x178506,_0x1c6201=_0x19c5f6[_0x109fb7];
if(!_0x1c6201||!_0x1c6201["length"])return;
var _0x20b1a2=_0x1c6201["find"]("span")["first"]()["text"]()["trim"]()||_0x1c6201["text"]()["trim"]();
_0x20b1a2&&(_0x4b7430[_0x20b1a2]=(_0x4b7430[_0x20b1a2]||0x0)+0x1);

}
);
var _0xd5648c=_0x15cbc9(),_0x4bb51d=Lampa["Storage"]["get"](STORAGE_ORIGINAL_ICONS,{

}
),_0x414dd6=[],_0x179775={

}
;
Object["keys"](_0x26c062)['forEach'](function(_0x705fa4){
var _0xca8295=_0x178506;
!_0x1b86b3["some"](function(_0x1584ae){
return _0x1584ae['id']===_0x705fa4;

}
)&&(_0x414dd6["push"]({
'type':"folder",'id':_0x705fa4
}
),_0x179775[_0x705fa4]=!![]);

}
);
_0x1b86b3['length']>0x0&&_0x1b86b3["forEach"](function(_0x195f22){
var _0xc8bd21=_0x178506;
if(_0x195f22['type']==='folder'&&!_0x179775[_0x195f22['id']])_0x414dd6['push']({
'type':"folder",'id':_0x195f22['id']
}
),_0x179775[_0x195f22['id']]=!![];
else _0x195f22["type"]==="button"&&!_0x179775[_0x195f22['id']]&&(!_0x1325d5["includes"](_0x195f22['id'])&&(_0x414dd6["push"]({
'type':'button','id':_0x195f22['id']
}
),_0x179775[_0x195f22['id']]=!![]));

}
);
_0x1d9044['forEach'](function(_0x4c6d2a){
var _0x154c6e=_0x178506;
!_0x179775[_0x4c6d2a]&&!_0x1325d5['includes'](_0x4c6d2a)&&(_0x414dd6["push"]({
'type':"button",'id':_0x4c6d2a
}
),_0x179775[_0x4c6d2a]=!![]);

}
),_0x414dd6["forEach"](function(_0x1d492f){
var _0x3615e0=_0x178506;
if(_0x1d492f["type"]==="folder"){
var _0x10eae0=_0x1d492f['id'],_0x332d6d=_0x5bcd03[_0x10eae0]||'Папка',_0x32c645=_0x78c958[_0x10eae0]||defaultFolderIcon,_0x374284=_0x26c062[_0x10eae0]||[],_0x3d690e=_0x91e596["indexOf"](_0x10eae0)!==-0x1,_0x7c7f72=$("<div class=\"menu-edit-list__item folder-item"+(_0x3d690e?" folder-hidden-item":'')+"\" data-id=\""+_0x10eae0+'\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22menu-edit-list__icon\x22>'+_0x32c645+"</div>                    <div class=\"menu-edit-list__title\">"+_0x332d6d+" <span class=\"menu-edit-list__title-sub\">("+_0x374284["length"]+")</span></div>                    <div class=\"menu-edit-list__delete selector\" title=\"Удалить папку\">                        <svg width=\"22\" height=\"22\" viewBox=\"0 0 26 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                            <rect x=\"1.89111\" y=\"1.78369\" width=\"21.793\" height=\"21.793\" rx=\"3.5\" stroke=\"currentColor\" stroke-width=\"3\"/>                            <path d=\"M9.5 9.5L16.5 16.5M16.5 9.5L9.5 16.5\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\"/>                        </svg>                    </div>                    <div class=\"menu-edit-list__edit selector\" title=\"Переименовать\">                        <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                            <path d=\"M16.474 5.408L18.592 7.526M16.474 5.408L7.408 14.474C7.146 14.736 7 15.088 7 15.456V17.5H9.044C9.412 17.5 9.764 17.354 10.026 17.092L19.092 8.026M16.474 5.408L19.092 8.026M19.092 8.026L21 6.118C21.39 5.728 21.39 5.092 21 4.704L19.296 3C18.908 2.61 18.272 2.61 17.882 3L16.474 4.408\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>                        </svg>                    </div>                    <div class=\"menu-edit-list__icon-edit selector\" title=\"Сменить иконку\">                        <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                            <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"1.5\"/>                            <circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\" fill=\"currentColor\"/>                            <path d=\"M21 15l-5-5L5 21\" stroke=\"currentColor\" stroke-width=\"1.5\"/>                        </svg>                    </div>                    <div class=\"menu-edit-list__move move-up selector\">                        <svg width=\"22\" height=\"14\" viewBox=\"0 0 22 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                            <path d=\"M2 12L11 3L20 12\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/>                        </svg>                    </div>                    <div class=\"menu-edit-list__move move-down selector\">                        <svg width=\"22\" height=\"14\" viewBox=\"0 0 22 14\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                            <path d=\"M2 2L11 11L20 2\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/>                        </svg>                    </div>                    <div class=\"menu-edit-list__toggle toggle selector\">                        <svg width=\"26\" height=\"26\" viewBox=\"0 0 26 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">                            <rect x=\"1.89111\" y=\"1.78369\" width=\"21.793\" height=\"21.793\" rx=\"3.5\" stroke=\"currentColor\" stroke-width=\"3\"/>                            <path d=\"M7.44873 12.9658L10.8179 16.3349L18.1269 9.02588\" stroke=\"currentColor\" stroke-width=\"3\" class=\"dot\" opacity=\""+(_0x3d690e?'0':'1')+"\" stroke-linecap=\"round\"/>                        </svg>                    </div>                </div>");
_0x7c7f72['find'](".menu-edit-list__edit")['on']("hover:enter",function(_0x2cd57d){
_0x2cd57d['stopPropagation'](),_0x21a29e(_0x10eae0,_0x332d6d,_0x3ccb5a);

}
),_0x7c7f72['find'](".menu-edit-list__icon-edit")['on']("hover:enter",function(_0x1f9e39){
var _0x52f879=_0x3615e0;
_0x1f9e39['stopPropagation'](),Lampa["Modal"]["close"](),setTimeout(function(){
_0x1892fd(_0x10eae0,_0x3ccb5a);

}
,0x64);

}
),_0x7c7f72["find"]('.move-up')['on']('hover:enter',function(_0x1974de){
var _0x94b617=_0x3615e0;
_0x1974de["stopPropagation"]();
var _0xcf7a98=_0x7c7f72["prev"]();
_0xcf7a98["length"]&&!_0xcf7a98['hasClass']("menu-edit-split")&&!_0xcf7a98["hasClass"]('menu-edit-list__create-folder')&&_0xcf7a98['data']('id')!=='show_names'&&_0x7c7f72["insertBefore"](_0xcf7a98);

}
),_0x7c7f72["find"]('.move-down')['on']("hover:enter",function(_0xe22763){
var _0x5d2392=_0x3615e0;
_0xe22763["stopPropagation"]();
var _0x1cd8fa=_0x7c7f72["next"]();
_0x1cd8fa["length"]&&!_0x1cd8fa["hasClass"]("menu-edit-split")&&!_0x1cd8fa['hasClass']('folder-reset-button')&&_0x7c7f72["insertAfter"](_0x1cd8fa);

}
),_0x7c7f72["find"](".toggle")['on']("hover:enter",function(_0xc75ed0){
var _0x60664=_0x3615e0;
_0xc75ed0["stopPropagation"]();
var _0x4fad7e=_0x5a9894(),_0x484dc6=_0x4fad7e["indexOf"](_0x10eae0);
_0x484dc6!==-0x1?(_0x4fad7e['splice'](_0x484dc6,0x1),_0x7c7f72["find"](".dot")["attr"]("opacity",'1'),_0x7c7f72['removeClass']("folder-hidden-item")):(_0x4fad7e["push"](_0x10eae0),_0x7c7f72["find"](".dot")['attr']('opacity','0'),_0x7c7f72["addClass"]("folder-hidden-item")),_0x1883f3(_0x4fad7e);

}
),_0x7c7f72["find"]('.menu-edit-list__delete')['on']("hover:enter",function(_0x1e5fd6){
var _0x582db8=_0x3615e0;
_0x1e5fd6["stopPropagation"](),Lampa['Modal']['close'](),Lampa["Noty"]["show"]('Папка\x20удалена'),_0x354ca4(_0x10eae0),setTimeout(function(){
var _0x30d50b=_0x582db8;
currentCard&&currentCard['length']&&currentCard[0x0]&&(applyButtonsLayout(currentCard),Lampa["Controller"]["toggle"]("content"));

}
,0xc8);

}
),_0x50619c['append'](_0x7c7f72);

}
else{
var _0x32ad9d=_0x1d492f['id'],_0xf8580c=_0x19c5f6[_0x32ad9d];
if(!_0xf8580c||!_0xf8580c["length"])return;
var _0x5c7a8a=_0x4d023d(_0x32ad9d,_0xf8580c),_0x221439=_0xd5648c[_0x32ad9d]||_0x4bb51d[_0x32ad9d]||_0xf8580c["find"]("svg")['first']()["prop"]("outerHTML")||'',_0x191466=_0x4b2042["has"](_0x32ad9d)?0x0:0x1,_0x4b390e=_0xf8580c["find"]('span')["first"]()["text"]()["trim"]()||_0xf8580c['text']()["trim"](),_0x372dde=_0x4b390e||_0x5c7a8a;
if(_0x4b390e&&_0x4b7430[_0x4b390e]>0x1){
var _0x4eb23e=_0xf8580c["attr"]("class")||'',_0x2df6d1=_0xf8580c['attr']('data-subtitle')||_0xf8580c['attr']("data-name")||_0xf8580c['attr']("data-id")||'';
if(_0x2df6d1){
var _0x1da506=_0x2df6d1["split"](/\s+/)[0x0];
if(_0x1da506["length"]>0x1e)_0x1da506=_0x1da506['substring'](0x0,0x1e);
_0x372dde=_0x4b390e+" <span class=\"menu-edit-list__title-sub\">("+_0x1da506+")</span>";

}
else{
var _0x27e374=_0x4eb23e["match"](/(?:button--|view--)(\w+)/);
_0x27e374&&_0x27e374[0x1]&&(_0x372dde=_0x4b390e+'\x20<span\x20class=\x22menu-edit-list__title-sub\x22>('+_0x27e374[0x1]+")</span>");

}

}
var _0x27f5ac=$("<div class=\"menu-edit-list__item\" data-id=\""+_0x32ad9d+"\">                    <div class=\"menu-edit-list__icon\">"+_0x221439+"</div>                    <div class=\"menu-edit-list__title\">"+_0x372dde+'</div>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22menu-edit-list__edit\x20selector\x22\x20title=\x22Изменить\x20название\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2222\x22\x20height=\x2222\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22M16.474\x205.408L18.592\x207.526M16.474\x205.408L7.408\x2014.474C7.146\x2014.736\x207\x2015.088\x207\x2015.456V17.5H9.044C9.412\x2017.5\x209.764\x2017.354\x2010.026\x2017.092L19.092\x208.026M16.474\x205.408L19.092\x208.026M19.092\x208.026L21\x206.118C21.39\x205.728\x2021.39\x205.092\x2021\x204.704L19.296\x203C18.908\x202.61\x2018.272\x202.61\x2017.882\x203L16.474\x204.408\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.5\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</svg>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22menu-edit-list__icon-edit\x20selector\x22\x20title=\x22Сменить\x20иконку\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2222\x22\x20height=\x2222\x22\x20viewBox=\x220\x200\x2024\x2024\x22\x20fill=\x22none\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<rect\x20x=\x223\x22\x20y=\x223\x22\x20width=\x2218\x22\x20height=\x2218\x22\x20rx=\x222\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.5\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<circle\x20cx=\x228.5\x22\x20cy=\x228.5\x22\x20r=\x221.5\x22\x20fill=\x22currentColor\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22M21\x2015l-5-5L5\x2021\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x221.5\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</svg>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22menu-edit-list__move\x20move-up\x20selector\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2222\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2022\x2014\x22\x20fill=\x22none\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22M2\x2012L11\x203L20\x2012\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x224\x22\x20stroke-linecap=\x22round\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</svg>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22menu-edit-list__move\x20move-down\x20selector\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2222\x22\x20height=\x2214\x22\x20viewBox=\x220\x200\x2022\x2014\x22\x20fill=\x22none\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22M2\x202L11\x2011L20\x202\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x224\x22\x20stroke-linecap=\x22round\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</svg>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22menu-edit-list__toggle\x20toggle\x20selector\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<svg\x20width=\x2226\x22\x20height=\x2226\x22\x20viewBox=\x220\x200\x2026\x2026\x22\x20fill=\x22none\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<rect\x20x=\x221.89111\x22\x20y=\x221.78369\x22\x20width=\x2221.793\x22\x20height=\x2221.793\x22\x20rx=\x223.5\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x223\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<path\x20d=\x22M7.44873\x2012.9658L10.8179\x2016.3349L18.1269\x209.02588\x22\x20stroke=\x22currentColor\x22\x20stroke-width=\x223\x22\x20class=\x22dot\x22\x20opacity=\x22'+_0x191466+'\x22\x20stroke-linecap=\x22round\x22/>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</svg>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>');
_0x4b2042["has"](_0x32ad9d)&&(_0x27f5ac["addClass"]("button-hidden"),_0x27f5ac["addClass"]("button-hidden-item"));
var _0x4de9e7=_0x27f5ac["find"](".menu-edit-list__title");
_0x27f5ac['find']('.menu-edit-list__icon-edit')['on']('hover:enter',function(_0x1f55d6){
var _0x5482b9=_0x3615e0;
_0x1f55d6["stopPropagation"]();
var _0x5a3e92=_0x1036a9;
Lampa["Modal"]['close'](),setTimeout(function(){
_0x2d9bca(_0x32ad9d,_0x3ccb5a,function(){
_0x1036a9=_0x5a3e92,setTimeout(function(){
var _0x3bce5f=_0x2bca;
_0x3ccb5a&&_0x3ccb5a["length"]&&_0x3ccb5a[0x0]&&openEditorMenu(_0x3ccb5a,_0x5a3e92,_0x254f19);

}
,0x64);

}
);

}
,0x64);

}
),_0x27f5ac["find"]('.menu-edit-list__edit')['on']("hover:enter",function(_0x1cd4e){
var _0x4c8678=_0x3615e0;
_0x1cd4e["stopPropagation"]();
var _0x184757=_0x4b390e||_0x5c7a8a;
_0x169143(_0x32ad9d,_0x184757,_0x3ccb5a,_0x27f5ac,_0x4de9e7,_0x254f19,$(this));

}
),_0x27f5ac["find"](".move-up")['on']("hover:enter",function(_0x4abc76){
var _0x4b4af4=_0x3615e0;
_0x4abc76["stopPropagation"]();
var _0x399204=_0x27f5ac["prev"]();
_0x399204['length']&&!_0x399204["hasClass"]("menu-edit-split")&&_0x399204['data']('id')&&_0x399204["data"]('id')!=="show_names"&&_0x27f5ac["insertBefore"](_0x399204);

}
),_0x27f5ac["find"](".move-down")['on']("hover:enter",function(_0x3c74dc){
var _0x5d9fca=_0x3615e0;
_0x3c74dc['stopPropagation']();
var _0x1d445d=_0x27f5ac["next"]();
_0x1d445d["length"]&&!_0x1d445d["hasClass"]("menu-edit-split")&&!_0x1d445d["hasClass"]("folder-reset-button")&&_0x27f5ac["insertAfter"](_0x1d445d);

}
),_0x27f5ac["find"](".toggle")['on']("hover:enter",function(_0x1a1644){
var _0x585234=_0x3615e0;
_0x1a1644["stopPropagation"](),_0x27f5ac["toggleClass"]('button-hidden'),_0x27f5ac['toggleClass']('button-hidden-item');
var _0x458846=_0x27f5ac["find"](".dot");
_0x458846["attr"]("opacity",_0x27f5ac["hasClass"]("button-hidden")?0x0:0x1);

}
),_0x50619c["append"](_0x27f5ac);

}

}
);
var _0x4cce70=$("<div class=\"folder-reset-button selector\">Сбросить все изменения</div>");
_0x4cce70['on']('hover:enter',function(){
var _0x3f825d=_0x178506;
Lampa["Storage"]["set"](STORAGE_ORDER,[]),Lampa["Storage"]['set'](STORAGE_HIDE,[]),Lampa["Storage"]["set"](STORAGE_SHOW_NAMES,!![]),Lampa['Storage']["set"](STORAGE_TITLES,{

}
),Lampa['Storage']["set"](STORAGE_ICONS,{

}
),Lampa["Storage"]["set"](STORAGE_FOLDER_TITLES,{

}
),Lampa['Storage']["set"](STORAGE_FOLDER_ICONS,{

}
),Lampa["Storage"]["set"](STORAGE_FOLDER_HIDE,[]),Lampa["Storage"]["set"](STORAGE_ITEM_ORDER,[]),_0xab48b7({

}
),buttonList=[],Lampa["Modal"]["close"](),Lampa['Noty']["show"]("Настройки сброшены"),setTimeout(function(){
var _0x5d8fe8=_0x3f825d;
_0x3ccb5a&&_0x3ccb5a['length']&&_0x3ccb5a[0x0]&&(applyButtonsLayout(_0x3ccb5a),Lampa["Controller"]["toggle"]("content"));

}
,0xc8);

}
),_0x50619c["append"](_0x4cce70),Lampa["Modal"]['open']({
'title':"Редактор кнопок",'html':_0x50619c,'size':_0xa4804a(),'scroll_to_center':!![],'onBack':function _0x3a68c8(){
var _0x5d8360=_0x178506,_0x42479c=[],_0x8b4801=[],_0x320a30=[],_0x8954c7=_0x1cf93c,_0xed253e=_0x50619c["find"](".menu-edit-list__item[data-id=\"show_names\"]");
_0xed253e['length']&&(_0x8954c7=!_0xed253e["hasClass"]('button-hidden'),Lampa["Storage"]['set'](STORAGE_SHOW_NAMES,_0x8954c7));
_0x50619c["find"](".menu-edit-list__item")["each"](function(){
var _0x19c663=_0x5d8360,_0x59db3d=$(this),_0x932b6f=_0x59db3d['data']('id');
if(!_0x932b6f||_0x932b6f==='show_names')return;
_0x932b6f['indexOf']("folder_")===0x0?_0x320a30["push"]({
'type':"folder",'id':_0x932b6f
}
):(_0x320a30["push"]({
'type':'button','id':_0x932b6f
}
),_0x42479c["push"](_0x932b6f),_0x59db3d["hasClass"]("button-hidden")&&_0x8b4801["push"](_0x932b6f));

}
),_0x2350f7(_0x320a30);
var _0x17ca63=_0x2e6676(STORAGE_ORDER),_0x4ad5d1=![];
if(_0x42479c["length"]!==_0x17ca63['length'])_0x4ad5d1=!![];
else for(var _0x3e18f8=0x0;
_0x3e18f8<_0x42479c["length"];
_0x3e18f8++){
if(_0x42479c[_0x3e18f8]!==_0x17ca63[_0x3e18f8]){
_0x4ad5d1=!![];
break;

}

}
_0x4ad5d1&&Lampa["Storage"]["set"](STORAGE_ORDER,_0x42479c),Lampa["Storage"]['set'](STORAGE_HIDE,_0x8b4801),Lampa["Modal"]['close'](),setTimeout(function(){
var _0xa7637d=_0x5d8360;
if(_0x3ccb5a&&_0x3ccb5a["length"]&&_0x3ccb5a[0x0]){
var _0x4c37e9=_0x3ccb5a["find"](".full-start-new__buttons");
_0x4c37e9["length"]&&_0x4c37e9["addClass"]("buttons-loading"),setTimeout(function(){
applyButtonsLayout(_0x3ccb5a),setTimeout(function(){
var _0x532db5=_0x2bca;
_0x4c37e9["length"]&&_0x4c37e9["removeClass"]("buttons-loading");

}
,0x64),setTimeout(function(){
var _0x25b2bb=_0x2bca;
try{
_0x254f19?Lampa["Controller"]['toggle'](_0x254f19):Lampa["Controller"]["toggle"]("content"),_0x1036a9&&setTimeout(function(){
_0x24b705(_0x3ccb5a,_0x1036a9),_0x1036a9=null;

}
,0x32);

}
catch(_0x213eca){
try{
Lampa["Controller"]['toggle']('content');

}
catch(_0x258703){

}

}

}
,0x32);

}
,0x96);

}

}
,0x64);

}

}
);

}
function startListeners(){
var _0x493d02=_0x1e843c;
_0x3868cb(),Lampa['Listener']['follow']("activity,full",function(_0x13b246){
var _0x25a4f9=_0x493d02;
if(_0x13b246["type"]==='complite'||_0x13b246["type"]==='archive'){
var _0x82c03f;
if(_0x13b246['object']&&_0x13b246["object"]["activity"]&&typeof _0x13b246['object']["activity"]["render"]==="function")_0x82c03f=_0x13b246["object"]["activity"]["render"]();
else _0x13b246["activity"]&&typeof _0x13b246["activity"]["render"]==='function'&&(_0x82c03f=_0x13b246['activity']['render']());
if(!_0x82c03f)return;
var _0x41cc86=$(_0x82c03f);
if(!_0x41cc86||!_0x41cc86["length"])return;
currentCard=_0x41cc86;
var _0x4585b9=_0x41cc86["find"](".full-start-new__buttons");
_0x4585b9["length"]&&(_0x4585b9["addClass"]("buttons-loading"),setTimeout(function(){
var _0x16e6cb=_0x25a4f9;
try{
applyButtonsLayout(_0x41cc86);
var _0x516e60=_0x41cc86["find"]('.full-start__button');
_0x516e60["off"]("hover:long")['on']("hover:long",function(){
openEditorMenu(_0x41cc86);

}
);

}
catch(_0x5213dd){

}

}
,0x64),setTimeout(function(){
var _0x3b734b=_0x25a4f9;
try{
applyButtonsLayout(_0x41cc86,!![]),_0x4585b9["removeClass"]("buttons-loading");

}
catch(_0x5f0fe3){
_0x4585b9["removeClass"]("buttons-loading");

}

}
,0x190));

}

}
);

}
function registerPlugin() {
    Lampa.Manifest.plugins = pluginInfo;
    startListeners();
}
function initPlugin() {
    window.plugin_card_buttons_editor_ready = true;
    if (window.appready) {
        registerPlugin();
    } else {
        Lampa.Listener.follow("app", function (e) {
            if (e.type === "ready") registerPlugin();
        });
    }
}
!window.plugin_card_buttons_editor_ready&&initPlugin();

}
)();
