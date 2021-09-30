$(function () {
    $('form').submit(function (event) {
        event.preventDefault();
        alert(validateData());
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
        return validateX() && validateY() && validateR();
    }

    function isNum(num) {
        return !isNaN(num) && isFinite(num);
    }

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
});
