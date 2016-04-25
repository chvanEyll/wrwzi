var storage = chrome.storage.sync;
//storage.clear(); //debug


// création de l'objet saved_link
function saved_link(title, url) {

	this.title = title;
	this.url = url;
	
}

// fonction onload: on affiche la liste
window.onload = function() { 

	get_stored_dict(refresh_list); 
	
	}

// création du bouton add_new
document.addEventListener('DOMContentLoaded', function() {
	
	document.querySelector("#add_new").addEventListener('click', function() { 
	
		get_stored_dict(add_new); 
		
		});
	
    });

// on refresh a chaque changement, evite de devoir appeler cette fonction incessamment
chrome.storage.onChanged.addListener(function(changes, namespace) { 

	get_stored_dict(refresh_list); 
	
	});
	
// fonction pour utiliser avec callback; "retourne" dictionnaire
function get_stored_dict(callback, arg) {
	
	storage.get(function(stored_data) {
		
		try {
			
			var check_dict_exists = Object.prototype.toString.call(stored_data.dict_of_links);
			
			// dernière vérification si try-catch échoue
			if (stored_data.dict_of_links.constructor == undefined) {
				var empty_dict = {};
				callback(empty_dict, arg);
				
				} else {
			
			callback(stored_data.dict_of_links, arg);
			
				}
			
		}
		
		catch(err) {
			
			var empty_dict = {};
			callback(empty_dict, arg);
			
		}
		
	})	
	
}	
	
// fonction qui raffraîchit les titres, url et boutons
function refresh_list(stored_dict, arg) {
	
	var dict_of_links = stored_dict;
	
	var main_div = document.getElementById("main body");
	main_div.innerHTML = "<br>";
	var delete_button = "<button type=\"button\" class=\"delete_link\">Delete</button>"
	var update_button = "<button type=\"button\" class=\"update_link\">Update</button>"
	var rename_button = "<button type=\"button\" class=\"rename_link\">Rename</button>"
	
	var indexOfDict = 0;
	
	// 	create titles and buttons
	for (var key in dict_of_links) {	
		
		var link = stored_dict[key];
		var title_and_link = " <a href= " + link.url + " target=\"_blank\">" + link.title + "</a>";
		var div_entry = "<div id= " + link.title + ">" + title_and_link + "<br>";
		div_entry += delete_button + " " + update_button + " " + rename_button + "</div>";
		//main_div.innerHTML = main_div.innerHTML + new_entry + stored_dict[key].delete_link;
		
		// on ajoute une ligne entre chaque titre
		var dict_length = Object.keys(dict_of_links).length;
		
		if (dict_length > 1) { // s'il y a plus d'un élément
		
			if (indexOfDict < dict_length - 1) { //sauf pour le dernier
		
				div_entry += "<hr>";					
				
				}
			}
		
		main_div.innerHTML = main_div.innerHTML + div_entry;
		indexOfDict += 1;
		
		};
		
	// add eventlisteners to delete buttons
	var all_delete_buttons = document.querySelectorAll(".delete_link");
	
	for (i = 0; i < all_delete_buttons.length; i++) { (function() {
		
		var current_button = all_delete_buttons[i];
		var link_title = current_button.parentNode.textContent;
		link_title = link_title.substring(1, link_title.length - 20); //le -20 sert a retirer les boutons
		
		current_button.addEventListener('click', function() { 
		
			get_stored_dict(delete_link, link_title);
		
			});
		}())};

	// add eventlisteners to update buttons
	var all_update_buttons = document.querySelectorAll(".update_link");
	
	for (i = 0; i < all_update_buttons.length; i++) { (function() {
		
		var current_button = all_update_buttons[i];
		var link_title = current_button.parentNode.textContent;
		link_title = link_title.substring(1, link_title.length - 20);
		
		current_button.addEventListener('click', function() { 
		
			get_stored_dict(update_link, link_title);
		
			});
		}());		
		}
		
	// add eventlisteners to rename buttons
	var all_rename_buttons = document.querySelectorAll(".rename_link");
	
	for (i = 0; i < all_rename_buttons.length; i++) { (function() {
		
		var current_button = all_rename_buttons[i];
		var link_title = current_button.parentNode.textContent;
		link_title = link_title.substring(1, link_title.length - 20);
		
		current_button.addEventListener('click', function() { 
		
			get_stored_dict(rename_link, link_title);
		
			});
		}());		
		}
	}

	
// fonction pour le bouton add_new
function add_new(stored_dict, arg) {
	
	var dict_of_links = stored_dict;
	
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		
		var link = new saved_link(tabs[0].title, tabs[0].url);
		dict_of_links[link.title] = link;
		storage.set({dict_of_links}, function() {});
		
			});
		};

// fonction pour les boutons delete
function delete_link(stored_dict, link_title) {
	
	if (confirm('Do you really want to delete this link?')) {
		var dict_of_links = stored_dict;
		delete dict_of_links[link_title];
		storage.set({dict_of_links}, function() {});
		
	}

	}
	
// fonction pour les boutons update
function update_link(stored_dict, link_title) {
	
	var dict_of_links = stored_dict;
	
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		
		var new_url = tabs[0].url;
		dict_of_links[link_title].url = new_url;
		storage.set({dict_of_links}, function() {});
		
			});
	
	}
	
// fonction pour les boutons rename
function rename_link(stored_dict, link_title) {
	
	var dict_of_links = stored_dict;
	var new_name = prompt("Enter a new name:",link_title);
	
	if ((new_name != link_title) && (new_name != null) && ((/[a-zA-Z]/.test(new_name)) || (/[0-9]/.test(new_name)))) {
		
		dict_of_links[new_name] = dict_of_links[link_title];
		dict_of_links[new_name].title = new_name;
		delete dict_of_links[link_title];
		storage.set({dict_of_links}, function() {});
		
		}
	
	}