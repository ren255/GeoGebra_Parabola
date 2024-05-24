function nolorizer(arg) {
    if (arg < 0) {
        return 0
    }
    return arg
}
function resetPoint(label, x, y = 0) {
    var command = label + "= Point({" + x + "," + y + "})";
    ggbApplet.evalCommand(command);
}

function resetField() {
    var Sdis = ggbApplet.getValue("Sdis"); // 発射位置
    var fieldReset = ggbApplet.getValue("fieldReset ");
    var ballC = 0;
    var robot2C = 1;

    fieldAl = 3;
    fieldBl = 2.4;
    fieldCl = 6.8;
    tarDis = 5.25


    if (fieldReset == ballC) {
        resetPoint("B", Sdis);
        resetPoint("A", Sdis + fieldBl);
        resetPoint("target", Sdis - tarDis);

        resetPoint("fieldE", Sdis - fieldCl, -1);
        resetPoint("fieldS", Sdis + fieldAl + fieldBl, -1);
    }
    if (fieldReset == robot2C) {
        resetPoint("A", Sdis);
        resetPoint("B", Sdis + fieldBl);
        resetPoint("target", Sdis + tarDis);

        resetPoint("fieldS", Sdis - fieldAl, -1);
        resetPoint("fieldE", Sdis + fieldCl, -1);
    }
}