$(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        if (validateData()) {
            $.ajax({
                url: "php/script.php",
                type: "POST",
                data: {x: getX(), y: getY(), r: getR()},
                success: function (data) {
                    let response = JSON.parse(data);
                    if (response.isValid) {
                        let nextRow = "<tr>";
                        nextRow += "<td>" + response.x + "</td>";
                        nextRow += "<td>" + response.y + "</td>";
                        nextRow += "<td>" + response.r + "</td>";
                        nextRow += "<td>" + response.currentTime + "</td>";
                        nextRow += "<td>" + response.executionTime + "</td>";
                        nextRow += "<td>" + response.hit + "</td>";
                        nextRow += "</tr>";
                        $("table").append(nextRow);
                    } else alert("Unexpected error has occurred.");
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
        let y = $("input[name='y-value']").val();
        let regex = /^[+-]?[0-9]{1,10}([.]?[0-9]{1,10})?$/;
        if (y.match(regex)) {
            return parseFloat(y);
        } else {
            return NaN;
        }
    }

    function getR() {
        if ($("#r-buttons").hasClass("ready")) {
            return parseFloat($("button[type='button'].selected-r").val());
        } else {
            return NaN;
        }
    }

    function validateX() {
        let count = 0;
        $("input[type='checkbox']:checked").each(function () {
            count++;
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
        let ready = $("#r-buttons").hasClass("ready");
        if (!ready) {
            $("#r-buttons").addClass("buttons-error");
        } else {
            $("#r-buttons").removeClass("buttons-error");
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
            url: "php/clear.php",
            type: "POST",
            success: function () {
                $("table > tr").remove();
            }
        });
    }

    function restore() {
        $.ajax({
            url: "php/restore.php",
            type: "POST",
            success: function (data) {
                let response = JSON.parse(data);
                for (let value of response) {
                    let newRow = "<tr>";
                    newRow += "<td>" + value.x + "</td>";
                    newRow += "<td>" + value.y + "</td>";
                    newRow += "<td>" + value.r + "</td>";
                    newRow += "<td>" + value.currentTime + "</td>";
                    newRow += "<td>" + value.executionTime + "</td>";
                    newRow += "<td>" + value.hit + "</td></tr>";
                    $("table").append(newRow);
                }
            }
        });
    }

    $("button[type='reset']").click(function () {
        if ($("button[type='button']").hasClass("selected-r")) {
            $("button[type='button']").removeClass("selected-r");
            $("#r-buttons").removeClass("ready");
        }
        clearTable();
    })

    $("button[type='button']").click(function () {
        if ($(this).hasClass("selected-r")) {
            $(this).removeClass("selected-r");
            $("#r-buttons").removeClass("ready");
        } else {
            $(this).addClass("selected-r");
            $(this).siblings("button.selected-r").removeClass("selected-r");
            $("#r-buttons").addClass("ready");
        }
    });
    restore();
});
