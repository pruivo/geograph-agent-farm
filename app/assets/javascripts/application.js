// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require jquery-ui-1.8.16.custom.min
//= require jtable
//= require jquery.blockUI
//= require jquery.tablesorter.min
//= require jquery.countup
//= require benchmark


$(document).ready(function() {
  /*menu handler*/
  $(function(){
    function stripTrailingSlash(str) {
      if(str.substr(-1) == '/') {
        return str.substr(0, str.length - 1);
      }
      return str;
    }

    var url = window.location.pathname;
    var activePage = stripTrailingSlash(url);

    $('.nav li a').each(function(){
      var currentPage = stripTrailingSlash($(this).attr('href'));

      if (activePage == currentPage) {
        $(this).parent().addClass('active');
      }
    });
  });

});

$(window).load(function() {
  $('#new-group-button').button();
  $('#process-edges-button').button();
  $('#inspect').button();

  $('#new-group-button').ajaxStart(function() {
    $.blockUI({ css: {
      border: 'none',
      padding: '15px',
      backgroundColor: '#000',
      '-webkit-border-radius': '10px',
      '-moz-border-radius': '10px',
      opacity: .5,
      color: '#fff'
    } });
  });

  $('#new-group-button').ajaxStop(function() {
    $.unblockUI();
  });

  loadSliders();
});


function loadSliders() {
  $('.agents-slider').slider({
    min: 0,
    max: 1000,
    step: 1,
    value: 0,
    create: function(event, ui) {
      var slider = $(this);
      var agents = slider.siblings('#agent_group_agents');
      $(this).slider('value', agents.attr('value'));
    },
    slide: function(event, ui) {
      var slider = $(ui.handle).parent();
      var group_id = slider.attr('rel');
      var label = $("#agents-selected-" + group_id);
      label.html(ui.value);

      var agents = slider.siblings('#agent_group_agents');
      agents.attr('value', ui.value);
    }
  });

  $('.delay-slider').slider({
    min: 0,
    max: 20000,
    step: 10,
    value: 0,
    create: function(event, ui) {
      var slider = $(this);
      var delay = slider.siblings('#agent_group_delay');
      $(this).slider('value', delay.attr('value'));
    },
    slide: function(event, ui) {
      var slider = $(this);//$(ui.handle).parent();

      var group_id = slider.attr('rel');
      var label = $("#delay-selected-" + group_id);
      label.html(ui.value);

      var delay = slider.siblings('#agent_group_delay');
      delay.attr('value', ui.value);
    }
  });


  $('.distance-slider').slider({
    min: 0,
    max: 100000,
    step: 50,
    value: 0,
    create: function(event, ui) {
      var slider = $(this);
      var distance = $('#process_distance');
      $(this).slider('value', distance.attr('value'));
    },
    slide: function(event, ui) {
      var slider = $(this);

      var group_id = slider.attr('rel');
      var label = $("#distance-selected-" + group_id);
      label.html(ui.value);

      var distance = $('#process_distance');
      distance.attr('value', ui.value);
    }
  });

}

function newGroup() {
  $('#new-group-modal').modal();
}

function editGroup(group) {
  $('#edit-group-' + group['id']).dialog({
    title: "Edit Agent Group " + group['name'],
    height: 420,
    width: 450,
    buttons: {
      "update": function() {
        $('#edit-agent-group-' + group['id']).submit();
        $(this).dialog("destroy");
        $(this).empty().remove();
      }
    }
  });
}

function destroyGroup(group) {
  $.ajax({
    url: 'agent_groups/' + group['id'],
    type: 'DELETE',
    dataType: 'script'
  });
}

function startGroup(group) {
  $.ajax({
    url: 'agent_groups/' + group['id'] + '/start',
    type: 'POST',
    dataType: 'script',
    headers: {
      'X-CSRF-Token': authenticity_token()
    }
  });
}

function stopGroup(group) {
  $.ajax({
    url: 'agent_groups/' + group['id'] + '/stop',
    type: 'POST',
    dataType: 'script',
    headers: {
      'X-CSRF-Token': authenticity_token()
    }
  });
}

function pauseGroup(group) {
  $.ajax({
    url: 'agent_groups/' + group['id'] + '/pause',
    type: 'POST',
    dataType: 'script',
    headers: {
      'X-CSRF-Token': authenticity_token()
    }
  });
}


function authenticity_token() {
  return $('meta[name="csrf-token"]').attr('content');
}


function chooseProcess() {
  $('#edges-processor').dialog({
    title: "Edges Processor",
    height: 300,
    width: 450,
    buttons: {
      "set": function() {
        //$( '#new_agent_group' ).submit();
        $.ajax({
          url: 'farm/' + $('#process_edges').val() + '/choose_process',
          data: {distance: $('#process_distance').val()},
          type: 'POST',
          dataType: 'script'
        });
        $(this).dialog("close");
      }
    }
  });
}