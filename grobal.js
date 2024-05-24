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
var v = ggbApplet.getValue("v"); // 初速度
v = nolorizer(v);
var a = ggbApplet.getValue("a"); // 角度
a = nolorizer(a);
var k = ggbApplet.getValue("k"); // 空気抵抗
k = nolorizer(k);
var g = ggbApplet.getValue("g"); // 重力
g = nolorizer(g);
var e = ggbApplet.getValue("e"); // 反発係数
e = nolorizer(e);
var h = ggbApplet.getValue("h"); // 発射位置
h = nolorizer(h);

function nolorizer(arg) {
    if (arg < 0) {
        return 0
    }
    return arg
}

function drawCurve(px, py, VelocityXY = null, label) {

    // 速度の計算
    var vx, vy;
    if (VelocityXY == null) {
        // 速度を角度から計算
        vx = v * Math.cos(a * Math.PI / 180);
        vy = v * Math.sin(a * Math.PI / 180);
    } else {
        // 与えられた速度を使用
        vx = VelocityXY[0];
        vy = VelocityXY[1];
    }
    vx = Math.round(vx * 1000) / 1000
    vy = Math.round(vy * 1000) / 1000
    px = Math.round(px * 1000) / 1000
    py = Math.round(py * 1000) / 1000

    var [intersectionData, xList] = calculateIntersectionData(px, py, VelocityXY);

    // commandArgs = stringAdder(xList[0],xList[1],xList);
    // 描画命令を GeoGebra に送信
    // ggbApplet.evalCommand(label + "= Function(" + commandArgs + ")");

    // 放物線運動の式のテキスト形式
    var xExpression = "(" + px + " + " + vx + " * (1 - exp(-" + k + " * t)) / " + k + ")";
    var yExpression = "(" + py + " + (" + vy + " + (g / " + k + ")) / " + k + " * (1 - exp(-" + k + " * t)) - (g * t) / " + k + ")";

    var command = label + " = Curve[" + xExpression + ", " + yExpression + ", t, 0, 100]";
    ggbApplet.evalCommand(command);

    return intersectionData;
}

function stringAdder(args) {
    var string = "";
    for (var i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            // 引数がリストの場合、再帰的に処理して文字列に追加
            string += stringAdder(args[i]);
        } else {
            string += args[i];
        }
        string += ",";
    }
    return string;
}

function calculateIntersectionData(px, py, VelocityXY) {
    // 放物線の軌道を計算
    var points = calculateParabolicMotionPoints(px, py, VelocityXY);

    // 地面との交点を探索
    for (var i = 0; i < points.length; i++) {
        // y=0との交点を見つける
        if (points[i].y < 0) {
            // 直前の点との間で補間して交点のx座標と速度を返す
            if (i > 0) {
                // 直前の点との間で線形補間を行い、交点のx座標を計算
                var slope = (points[i].y - points[i - 1].y) / (points[i].x - points[i - 1].x);
                var xIntersect = points[i - 1].x - (points[i - 1].y / slope);
                // 交点での速度を取得
                var vxIntersect = points[i].vx;
                var vyIntersect = points[i].vy;

                var xList = points.map(point => point.x);
                return [{ x: xIntersect, vx: vxIntersect, vy: vyIntersect }, xList];
            }
        }
    }
    return null; // 交点が見つからない場合は null を返す
}

function calculateParabolicMotionPoints(px, py, VelocityXY = null) {
    // 初期速度の計算
    var vx, vy;
    if (VelocityXY == null) {
        // 速度を角度から計算
        vx = v * Math.cos(a * Math.PI / 180);
        vy = v * Math.sin(a * Math.PI / 180);
    } else {
        // 与えられた速度を使用
        vx = VelocityXY[0];
        vy = VelocityXY[1];
    }

    // 放物線運動の式の計算
    var points = [];
    var t = 0;
    var dt = 0.1;
    while (t <= 200) {
        var exp_kt = Math.exp(-k * t);
        var x = px + (vx / k) * (1 - exp_kt);
        var y = py + ((vy + g / k) / k) * (1 - exp_kt) - (g * t / k);

        var correntVX = vx * exp_kt;
        var correntVY = vy * exp_kt - (g / k) * (1 - exp_kt);

        points.push({ x: x, y: y, vx: correntVX, vy: correntVY });
        t += dt;
    }
    return points;
}


function newVelocity(currentVelocity) {
    var vx = currentVelocity[0];
    var vy = currentVelocity[1];

    // 新しい速度の計算（反発係数を考
    var newVy = -vy * e;

    return [vx, newVy];
}
// grobal --------------------------------------------------------------------
function draw() {
    var intersectionData = drawCurve(0, h, null, "Curve");

    // curveList is list of label for Curves
    for (var i = 1; i < 10; i++) {
        var newVelocityXY = [intersectionData.vx, intersectionData.vy];
        newVelocityXY = newVelocity(newVelocityXY);
        var label = "curve" + i;
        intersectionData = drawCurve(intersectionData.x, 0, newVelocityXY, label);
    }
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