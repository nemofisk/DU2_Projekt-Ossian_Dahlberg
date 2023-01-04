
// G
// CODE According to specification
function click_filter_element(event) {

  /*
    ARGUMENTS
      event: event-object created when user clicks on one of the filter elements.

    SIDE-EFFECTS
      Marks the clicked filter element as selected / unselected.
      Since a filter element will have changed after the click, the list of
      programmes must be updated.

      Attention VG
        Careful with the propagation of the click-event

    NO RETURN VALUE

  */
  event.target.classList.toggle("selected");
  update_programmes();
}


// G
// CODE according to specification
function create_filter_element(data) {

  /*
    ARGUMENTS
      data: object that contains the following keys:
        class (string): a class-name given to the created element
        textContent (string): the text that the element contains
        parent (reference to HTML-element): the HTML-element that is the parent of the created element

      No control of arguments.

    SIDE-EFFECTS
      Creates a new dom-element with the tag "li".
      Gives the new dom-element the class contained in data.class
      Appends the new dom-element to the element referenced in data.parent
      Sets the text content of the new dom-element to data.textContent
      Sets the function click_filter_element as a listener to "click" for the new dom-element

    RETURN VALUE
      Returns a reference to the new dom-element
  */

  const parent = data.parent;
  const klass = data.class;
  const text_cont = data.textContent;

  const li_dom = document.createElement("li");
  parent.appendChild(li_dom);
  li_dom.classList.add(klass);
  li_dom.textContent = text_cont;

  li_dom.addEventListener("click", click_filter_element);

  return li_dom;
}


// VG
// CODE according to specification
function add_group_toggling(filter_container_dom) {

  /*
    ARGUMENT
      filter_container_dom: reference to a HTML-element that contains a set of fliter_elements
            Exempel: the <ul> that contains the filters for Language.

    SIDE EFFECTS
      The function makes sure that when the user clicks on filter_container_dom, all the
      filter_elements that it contains are selected / unselected.
      Since some filter elements will have changed after the click, the list of
      programmes must be updated.

    NO RETURN VALUE

  */

  filter_container_dom.addEventListener("click", toggle_group);

  function toggle_group(event) {
    const first_filter_element = filter_container_dom.children[1].children[0];
    let event_target_filters;

    if (event.target.parentElement.className.includes("filter_container")) {
      event_target_filters = document.querySelectorAll(`#${event.target.parentElement.id} > ul > li`);
    } else {
      if (event.target.className.includes("filter_container")) {
        event_target_filters = document.querySelectorAll(`#${event.target.id} > ul > li`);
      }
    }
    function remove_class(filter) {
      filter.classList.remove("selected");
    }
    function add_class(filter) {
      filter.classList.add("selected")
    }

    if (first_filter_element.className === "selected") {
      array_each(event_target_filters, remove_class);
    } else {
      array_each(event_target_filters, add_class);
    }

    update_programmes();
  }

}


// VG
// CODE according to specifications
function toggle_cities(event) {

  /*
 
    ARGUMENTS
      This function does not take any arguments
 
    SIDE EFFECTS
      This function checks the state of the first city-filter-element (Madrid).
      If it is selected then it de-selects ALL city-filter-elements
      If it is de-selected then it selects ALL city-filter-elements 
 
    NO RETURN VALUE
 
  */

}


// WRITE SPECIFICATION
// ATTENTION: You need to write the specification of all three functions:
//            create_countries_cities_filters, create_country and create_city
function create_countries_cities_filters() {
  function create_country(country) {
    const dom = document.createElement("div");
    dom.classList.add("country");
    dom.classList.add("filter_container");
    dom.id = "country_" + country.id;
    document.querySelector("#country_filter > ul").append(dom);

    dom.innerHTML = `
      <h1>${country.name}</h1>
      <ul class="filter_list"></ul>
    `;

    const cities = array_filter(CITIES, test_function);
    function test_function(city) {
      return city.countryID === country.id;
    }

    array_each(cities, create_city);
  }
  function create_city(city) {

    const dom = create_filter_element({
      parent: document.querySelector(`#country_${city.countryID} > ul`),
      class: "selected",
      textContent: city.name,
    });
    dom.dataset.id = city.id;

  }

  array_each(COUNTRIES, create_country);
}


// G
// ABSTRACT AND WRITE SPECIFICATION
//    As you can see, all three functions below do basically the same thing.
//    Abstract them to one function, and write the specification of that function.

function create_filters(array, filter_name) {

  /* 
    ARGUMENTS
      array: An array that will be looped through and call function "create_filter" for each element in array, must be an array.
      filter_name: A string that completes the ID of the selected parent for the new filter, must be a string.
 
    SIDE EFFECTS:
      This function loops through the array specified through the "array" argument and calls the function "create_filter" for each element in the array. An <li> HTML-element will be created for each element in the specified array that will be placed in the parent specified with the argument "filter_name", the <li> element will be given the class "selected" and it's textContent will be the value within the key "name" from the current object of the specified array.
 
    NO RETURN VALUE.
  */

  function create_filter(filter_object) {
    const dom = create_filter_element({
      parent: document.querySelector(`#${filter_name}_filter > ul`),
      class: "selected",
      textContent: filter_object.name,
    })
    dom.dataset.id = filter_object.id;
  }
  array_each(array, create_filter)
}

// G / VG (see details in specification)
// CODE according to specifications
function create_programme(programme) {

  /*
 
    ARGUMENT
      programme (object): One of the objects from PROGRAMMES
 
    SIDE-EFFECTS
      This function creates the HTML-element that contains all the information
      about one programme, as seen in the video / image.
      
      VG: The background image is a random image from among the images of the city
          in which the programme is (via the university)
      G:  No background image required.
 
 
      VG: The "see more" interaction must be included.
      G:  The "see more" element is not required. And that information needs not be in place.
 
    NO RETURN VALUE
 
  */

  const university = get_object(programme.universityID, UNIVERSITIES);
  const city = get_object(university.cityID, CITIES);
  const country = get_object(city.countryID, COUNTRIES);
  const level = get_object(programme.levelID, LEVELS);
  const subject = get_object(programme.subjectID, SUBJECTS);
  const language = get_object(programme.languageID, LANGUAGES);

  const city_image_index = get_random_number(city.imagesNormal.length, 0);
  const city_image = city.imagesNormal[city_image_index];

  function get_object(object_id, database_array) {
    for (let i = 0; i < database_array.length; i++) {
      if (object_id === database_array[i].id) {
        return database_array[i]
      }
    }
  }

  const parent = document.querySelector("#programmes > ul");

  const li_dom = document.createElement("li");
  parent.appendChild(li_dom);
  li_dom.classList.add("programme");
  li_dom.style.backgroundImage = `url(media/geo_images/${city_image})`;

  li_dom.innerHTML = `
  <div>
    <p><strong>${programme.name}</strong></p>
    <p>${university.name}</p>
    <p>${city.name}, ${country.name}</p>
    <p>${level.name}, ${subject.name}, ${language.name}</p>
  </div>
  

  <p class="bottom_programme">${city.name}, sun-index: ${city.sun}</p>
  `

}


// G
// CODE according to the specification
function update_programmes() {

  /*
      NO ARGUMENTS
 
      SIDE EFFECTS
        This function updates the programmes shown on the page according to
        the current filter status (which filter elements are selected / unselected).
        It uses the function read_filters to know which programmes need to be included.
 
        VG: The top images (header) need to be updated here
 
      NO RETURN VALUE
 
  */

  for (let i = 0; i < 3; i++) {
    const country_index = get_random_number(COUNTRIES.length, 0);
    const image_index = get_random_number(COUNTRIES[country_index].imagesNormal.length, 0);
    const image_url = COUNTRIES[country_index].imagesNormal[image_index];

    const div_dom = document.querySelector("#top_images");
    const div_dom_child = div_dom.children[i]

    div_dom_child.style.backgroundImage = `url(media/geo_images/${image_url})`;
  }

  const filtered_programmes_array = read_filters();
  if (filtered_programmes_array.length > 0) {
    document.querySelector("#programmes > p").innerHTML = "";
  } else {
    document.querySelector("#programmes > p").innerHTML = "Inga program upfyller nuvarande filter.";
  }
  const programmes_list = document.querySelector("#programmes > ul");
  programmes_list.innerHTML = "";

  array_each(filtered_programmes_array, create_programme);
}



// G
// WRITE SPECIFICATION
// You must understand how this function works. There will be questions about it
// in the code review (kodredovisning)

// Optional VG: Which parts of the function's code could be abstracted?
//              Implement it
function read_filters() {

  const city_selected_dom = document.querySelectorAll("#country_filter li.selected");

  const city_id_selected = [];
  function callback_add_cityID(dom_element) {
    const id_as_integer = parseInt(dom_element.dataset.id);
    city_id_selected.push(id_as_integer);
  }
  array_each(city_selected_dom, callback_add_cityID);

  const universities = [];
  for (let i = 0; i < city_id_selected.length; i++) {
    const city_id = city_id_selected[i];
    for (let ii = 0; ii < UNIVERSITIES.length; ii++) {
      const university = UNIVERSITIES[ii];
      if (university.cityID === city_id) {
        universities.push(university);
      }
    }
  }

  let programmes = [];
  function callback_add_programmes(university) {
    const university_id = university.id;
    for (let i = 0; i < PROGRAMMES.length; i++) {
      const programme = PROGRAMMES[i];
      if (programme.universityID === university_id) {
        programmes.push(programme);
      }
    }
  }
  array_each(universities, callback_add_programmes);



  const level_selected_dom = document.querySelectorAll("#level_filter li.selected");
  const level_id_selected = [];
  function callback_add_levelID(dom_element) {
    const id_as_integer = parseInt(dom_element.dataset.id);
    level_id_selected.push(id_as_integer);
  }
  array_each(level_selected_dom, callback_add_levelID);

  function test_function_level(programme) {
    return level_id_selected.includes(programme.levelID);
  }
  programmes = array_filter(programmes, test_function_level);



  const language_selected_dom = document.querySelectorAll("#language_filter li.selected");
  const language_id_selected = [];
  function callback_add_languageID(dom_element) {
    const id_as_integer = parseInt(dom_element.dataset.id);
    language_id_selected.push(id_as_integer);
  }
  array_each(language_selected_dom, callback_add_languageID);



  function test_function_language(programme) {
    return language_id_selected.includes(programme.languageID);
  }
  programmes = array_filter(programmes, test_function_language);



  const subject_selected_dom = document.querySelectorAll("#subject_filter li.selected");
  const subject_id_selected = [];
  function callback_add_subjectID(dom_element) {
    const id_as_integer = parseInt(dom_element.dataset.id);
    subject_id_selected.push(id_as_integer);
  }
  array_each(subject_selected_dom, callback_add_subjectID);



  function test_function_subject(programme) {
    return subject_id_selected.includes(programme.subjectID);
  }
  programmes = array_filter(programmes, test_function_subject);



  const search_string = document.querySelector("#search_field input").value;
  if (search_string !== "") {
    function test_function(programme) {
      return programme.name.includes(search_string);
    }
    programmes = array_filter(programmes, test_function);
  }

  return programmes;
}
