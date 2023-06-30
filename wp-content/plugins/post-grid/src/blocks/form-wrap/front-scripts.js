
document.addEventListener("DOMContentLoaded", function (event) {



    var formWrap = document.querySelectorAll('.pg-form-wrap');
    var pgFormFields = document.querySelectorAll('.pg-form-field');

    /*Hide all error message on load form*/

    if (pgFormFields != null) {
        pgFormFields.forEach(pgFormField => {

            var fieldId = pgFormField.getAttribute("id");
            var errorWrap = document.querySelector('#' + fieldId + ' .error-wrap');

            if (errorWrap != null) {
                errorWrap.style.display = 'none';
            }




        })
    }


    /*Check each form on page load*/

    var BreakException = {};

    var busy = false;

    try {


        if (formWrap != null) {
            formWrap.forEach(form => {
                var formId = form.getAttribute("formId");


                form.addEventListener('submit', event => {

                    //console.log('#### Form On Submit');


                    event.preventDefault();

                    var formByID = document.querySelector('.' + formId);
                    const formData = new FormData(event.target);
                    var onsubmitprams = formByID.getAttribute("onsubmitprams");
                    var formargs = formByID.getAttribute("formargs");
                    var onprocessargs = formByID.getAttribute("onprocessargs");


                    var onsubmitObj = JSON.parse(onsubmitprams);
                    var formargsObj = JSON.parse(formargs);
                    var fieldInfo = formargsObj.fieldInfo;

                    var onprocessargsObj = JSON.parse(onprocessargs);



                    formData.append('formType', formargsObj.type);
                    formData.append('onprocessargs', JSON.stringify(onprocessargsObj));


                    var loadingWrap = document.querySelector('.' + formId + '-loading');
                    var responsesWrap = document.querySelector('.' + formId + '-responses');


                    loadingWrap.style.display = 'block';



                    // for (var pair of formData.entries()) {
                    //     //console.log(pair[0] + ', ' + pair[1]);
                    // }


                    onsubmitObj.map(action => {

                        var actionId = action.id;

                        if (actionId == "validation") {
                            var errors = validateFormFields(formId, formData, fieldInfo);

                            console.log(errors);
                            responsesWrap.innerHTML = "";

                            loadingWrap.style.display = 'none';
                            if (Object.keys(errors).length > 0) {
                                var responseHtml = '';
                                Object.entries(errors).map(x => {
                                    var html = x[1];
                                    responseHtml += '<div class="error">';
                                    responseHtml += html;
                                    responseHtml += '</div>';
                                })
                                responsesWrap.innerHTML = responseHtml;
                                responsesWrap.style.display = 'block';

                                loadingWrap.style.display = 'none';
                                throw errors
                            };
                        }

                        if (actionId == "submitConfirm") {
                            if (confirm('Are you confirmed?')) {
                                processSubmit(formId, formData,);
                            } else {
                                return;
                            }
                        }
                    })


                    //formData.append('formData', formData);


                    setTimeout(() => {




                    }, 3000)


                })

            }
            )
        }

    } catch (e) {
        if (e !== BreakException) throw e;
    }





    const sleep = async (milliseconds) => {
        await new Promise(resolve => {
            return setTimeout(resolve, milliseconds)
        });
    };



    function validateFormFields(formId, formData, fieldInfo) {


        var errorData = {};

        Object.entries(fieldInfo).map(field => {
            var fieldId = field[0];

            var args = field[1];

            var inputName = args.inputName
            var errorText = args.errorText;
            var required = (args.required == undefined) ? false : args.required;

            errorData[inputName] = { id: fieldId, errorText: errorText, required: required };

        })

        console.log(errorData);


        var errors = {};

        var formByID = document.querySelector('.' + formId);

        for (var pair of formData.entries()) {
            var inputName = pair[0];
            var inputValue = pair[1];

            var required = (errorData[inputName] == undefined) ? false : errorData[inputName].required;

            if (required && inputValue.length == 0) {
                errors[inputName] = errorData[inputName].errorText;

                var fieldWrap = document.querySelector('.' + errorData[inputName].id);
                fieldWrap.classList.add('error');
                console.log(fieldWrap);


            }

        }

        return errors;

    }



    function processSubmit(formId, formData) {

        //console.log('### processSubmit');
        //console.log(formData);

        var formByID = document.querySelector('.' + formId);
        var responsesWrap = document.querySelector('.' + formId + '-responses');
        var loadingWrap = document.querySelector('.' + formId + '-loading');
        responsesWrap.style.display = 'none';

        var aftersubmitargs = formByID.getAttribute("aftersubmitargs");
        var aftersubmitargsObj = JSON.parse(aftersubmitargs);

        //console.log(aftersubmitargsObj);


        var formFieldNames = [];


        for (var pair of formData.entries()) {
            var inputName = pair[0];
            var inputValue = pair[1];

            //console.log(inputValue);


            formFieldNames.push(inputName)
        }

        //console.log(formFieldNames);
        formData.append('formFieldNames', formFieldNames);


        fetch(post_grid_vars['siteUrl'] + "/wp-json/post-grid/v2/process_form_data", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok && response.status < 400) {
                    response.json().then((data) => {
                        var successArgs = (data.success == undefined) ? {} : data.success;
                        var errorsArgs = (data.errors == undefined) ? {} : data.errors;

                        console.log(data);


                        aftersubmitargsObj.map(action => {

                            var actionId = action.id;

                            if (actionId == "showResponse") {

                                console.log('showResponse');



                                responsesWrap.style.display = 'block';

                                var responseHtml = '';

                                Object.entries(successArgs).map(x => {
                                    var html = x[1];
                                    responseHtml += '<div class="success">';
                                    responseHtml += html;
                                    responseHtml += '</div>';
                                })

                                Object.entries(errorsArgs).map(x => {
                                    var html = x[1];
                                    responseHtml += '<div class="error">';
                                    responseHtml += html;
                                    responseHtml += '</div>';
                                })


                                responsesWrap.innerHTML = responseHtml;

                            }

                            if (actionId == "redirectToURL") {

                                console.log('redirectToURL');


                                var url = action.url;

                                location.href = url;


                            }
                            if (actionId == "loggedOut") {

                                console.log('loggedOut');


                                fetch(post_grid_vars['siteUrl'] + "/wp-json/post-grid/v2/loggedout_current_user", {
                                    method: "POST",
                                    body: { nonce: formFieldNames.form_wrap_nonce },
                                })
                                    .then((response) => {
                                        if (response.ok && response.status < 400) {
                                            response.json().then((data) => {



                                            });
                                        }
                                    })
                                    .catch((error) => { });











                            }

                            if (actionId == "hideForm") {

                                console.log('hideForm');


                                formByID.style.display = 'none'

                            }


                            if (actionId == "clearForm") {

                                console.log('clearForm');


                                formByID.reset();



                            }


                        })





                        //console.log(responseArgs);
                        loadingWrap.style.display = 'none';



                        setTimeout(() => {
                            //responsesWrap.style.display = 'none';

                        }, 2000)


                    });
                }
            })
            .catch((error) => { });


    }





    /*Form Visiblity*/





    function popupDelay() {


        var dataVisible = document.querySelectorAll('[data-pgfw-visible]');

        console.log(dataVisible);


        if (dataVisible != null) {
            dataVisible.forEach(item => {
                var attr = item.getAttribute("data-pgfw-visible");
                var attrObj = JSON.parse(attr);
                var popupId = item.getAttribute("formid");
                var popupPrams = item.getAttribute("formargs");
                var popupPramsObj = JSON.parse(popupPrams);

                var isLogged = popupPramsObj.isLogged;
                var userId = popupPramsObj.userId;
                var currentUserRoles = popupPramsObj.userRoles;

                console.log(currentUserRoles);


                var popupWrap = document.querySelector('[formid="' + popupId + '"]');

                Object.entries(attrObj).map(group => {

                    var groupData = group[1];
                    var groupLogic = groupData.logic;
                    var groupArgs = groupData.args;

                    groupArgs.map(conditions => {
                        var conditionId = conditions.id;



                        if (conditionId == 'delay') {
                            setTimeout(() => {
                                popupWrap.style.display = 'block';
                            }, parseInt(conditions.value))
                        }


                        if (conditionId == 'initial') {
                            popupWrap.style.display = 'block';

                        }


                        if (conditionId == 'cookieExist') {
                            var cookieExist = hasCookie(conditions.value);

                            if (cookieExist) {
                                popupWrap.style.display = 'block';
                            }
                        }


                        if (conditionId == 'cookieNotExist') {
                            var cookieExist = hasCookie(conditions.value);

                            if (cookieExist == undefined) {
                                popupWrap.style.display = 'block';
                            }
                        }



                        if (conditionId == 'userLogged') {

                            if (isLogged) {
                                popupWrap.style.display = 'block';
                            } else {
                                popupWrap.style.display = 'none';
                            }
                        }

                        if (conditionId == 'userNotLogged') {

                            if (isLogged) {
                                popupWrap.style.display = 'none';

                            } else {
                                popupWrap.style.display = 'block';

                            }
                        }


                        if (conditionId == 'userRoles') {

                            var roleExist = false;
                            var userRoles = conditions.roles;
                            //var userIdsX = userIds.map(x => parseInt(x));

                            console.log(Object.entries(currentUserRoles).length);
                            console.log(userRoles);

                            if (Object.entries(currentUserRoles).length == 0) {
                                popupWrap.style.display = 'none';

                            }

                            console.log(Object.entries(currentUserRoles).toString());



                            Object.entries(currentUserRoles).map(role => {

                                roleName = role[1];

                                if (userRoles.includes(roleName)) {
                                    roleExist = true;
                                    popupWrap.style.display = 'block';

                                    console.log('roleExist', roleExist);

                                    return;
                                } else {
                                    popupWrap.style.display = 'none';

                                }

                            })



                        }



                        if (conditionId == 'userId') {

                            var userIds = conditions.value.split(',');
                            var userIdsX = userIds.map(x => parseInt(x));
                            if (userIdsX.includes(parseInt(userId))) {
                                popupWrap.style.display = 'block';
                            }
                        }


                        if (conditionId == 'urlPrams') {

                            var urlPrams = conditions.value.split(',');
                            urlPrams.map(x => {

                                console.log(x);


                                if (hasUrlPrams(x)) {
                                    popupWrap.style.display = 'block';
                                }

                            });



                        }




                    })

                })

            })

        }




    }


    popupDelay()







});

