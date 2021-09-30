$(function () {
    $('form').submit(function (event) {
        event.preventDefault();
        if (validateData()) {
            $.ajax({
                url: "script.php",
                method: "POST",
                data: {x: getX(), y: getY(), r: getR()},
                cache: false,
                success: function (data) {
                    let response = JSON.parse(data);
                    if (response.isValid) {
                        nextRow = "<tr>";
                        nextRow += "<td>" + response.x + "</td>";
                        nextRow += "<td>" + response.y + "</td>";
                        nextRow += "<td>" + response.r + "</td>";
                        nextRow += "<td>" + response.currentTime + "</td>";
                        nextRow += "<td>" + response.executionTime + "</td>";
                        nextRow += "<td>" + response.hit + "</td>";
                        nextRow += "</tr>";
                        $("#result-table").append(nextRow);
                    } else alert("Unexpected error has occured");
                },
                error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    console.log(msg);
                }
            });
        }
    })

    function getX() {
        let count = 0;
        $("input[type='checkbox']:checked").each(function () {
            count++;
        });
        if (count === 1) {
            return parseFloat($("input[type='checkbox']:checked").val());
        } else {
            return NaN
        }
    }

    function getY() {
        let y = $("input[name='Yvalue']").val();
        let regex = /^[+-]?[0-9]{1,10}([.]?[0-9]{1,10})?$/;
        if (y.match(regex)) {
            return parseFloat(y);
        } else {
            return NaN;
        }
    }

    function getR() {
        if ($("#Rbuttons").hasClass("ready")) {
            return parseFloat($("button[type='button'].selectedR").val());
        } else {
            return NaN;
        }
    }

    function validateX() {
        let count = 0;
        $("input[type='checkbox']").each(function () {
            if ($(this).prop("checked")) {
                count++;
            }
        });
        if (count > 1 || count === 0) {
            $(".check-block").addClass("checkbox-error");
            return false;
        } else {
            $(".check-block").removeClass("checkbox-error");
            return true;
        }
    }

    function validateY() {
        let y = getY();
        const MIN_Y = -3;
        const MAX_Y = 5;
        if (isNum(y) && y > MIN_Y && y < MAX_Y) {
            $("input[type='text']").removeClass('text-error');
            return true;
        } else {
            $("input[type='text']").addClass('text-error');
            return false;
        }
    }

    function validateR() {
        let ready = $("#Rbuttons").hasClass("ready");
        if (!ready) {
            $("#Rbuttons").addClass("buttons-error");
        } else {
            $("#Rbuttons").removeClass("buttons-error");
        }
        return ready;
    }

    function validateData() {
        let x = validateX();
        let y = validateY();
        let r = validateR();
        return x && y && r;
    }

    function isNum(num) {
        return !isNaN(num) && isFinite(num);
    }

    function clearTable() {
        $.ajax({
            url: "clear.php",
            type: "POST",
            success: function () {
                $("#result-table > tr").remove();
            }
        });
    }

    function restore() {
        $.ajax({
            url: "restore.php",
            type: "POST",
            success: function (data) {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
                for (str of data) {
                    newRow = '<tr>';
                    newRow += '<td>' + str.x + '</td>';
                    newRow += '<td>' + str.y + '</td>';
                    newRow += '<td>' + str.r + '</td>';
                    newRow += '<td>' + str.currentTime + '</td>';
                    newRow += '<td>' + str.executionTime + '</td>';
                    newRow += '<td>' + str.hit + '</td></tr>';
                    $('#result-table').append(newRow);
                }
            }
        });
    }

    $("button[type='reset']").click(function () {
        if ($("button[type='button']").hasClass("selectedR")) {
            $("button[type='button']").removeClass("selectedR");
            $("#Rbuttons").removeClass("ready");
        }
        clearTable();
    })

    $("button[type='button']").click(function () {
        if ($(this).hasClass("selectedR")) {
            $(this).removeClass("selectedR");
            $("#Rbuttons").removeClass("ready");
        } else {
            $(this).addClass("selectedR");
            $(this).siblings("button.selectedR").removeClass("selectedR");
            $("#Rbuttons").addClass("ready");
            $("#Rbuttons").removeClass("buttons-error");
        }
    });
    restore();
});
