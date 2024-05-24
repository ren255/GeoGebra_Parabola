// https://github.com/ren255/GeoGebra_Parabola

function nolorizer(arg) {
    if (arg < 0) {
        return 0;
    }
    return arg;
}

function roundToThree(num) {
    return +(Math.round(num * 1000) / 1000).toFixed(3);
}

function resetPoint(label, x, y = 0) {
    var command = label + "= Point({" + x + "," + y + "})";
    ggbApplet.evalCommand(command);
}

function getdata(label) {
    var value = ggbApplet.getValue(label); // 初速度
    value = nolorizer(value);
    return value;
}

// draw function's
function drawCurve(px, py, VelocityXY = null, label) {
    var v = getdata("v");
    var a = getdata("a");
    // var k = getdata("k");
    var g = 9.8;

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

    var [intersectionData, xList] = calculateIntersectionData(px, py, [vx, vy]);

    // 放物線運動の式のテキスト形式
    var xExpression = "(" + px + " + " + vx + " * (1 - exp(-k * t)) / k)";
    var yExpression = "(" + py + " + (" + vy + " + (" + g + " / k)) / k * (1 - exp(-k * t)) - (" + g + " * t) / k)";

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
    // グローバル変数の取得
    var v = getdata("v");
    var a = getdata("a");
    var k = getdata("k");
    var g = getdata("g");

    // 初期速度の計算
    var vx, vy;
    if (VelocityXY == null) {
        // 速度を角度から計算
        vx = v * Math.cos(a * Math.PI / 180);
        vx = roundToThree(vx);
        vy = v * Math.sin(a * Math.PI / 180);
        vy = roundToThree(vy);
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
        var oneMinusExpKt = roundToThree(1 - exp_kt);
        var roundedVXOverK = roundToThree(vx / k);
        var roundedVyPlusGOverKOverK = roundToThree(roundToThree(vy + g / k) / k);
        var roundedGOverK = roundToThree(g / k);
        var roundedGTOverK = roundToThree(g * t / k);

        var x = px + roundedVXOverK * oneMinusExpKt;
        x = roundToThree(x);
        var y = py + roundedVyPlusGOverKOverK * oneMinusExpKt - roundedGTOverK;
        y = roundToThree(y);

        var correntVX = vx * exp_kt;
        correntVX = roundToThree(correntVX);
        var correntVY = vy * exp_kt - roundedGOverK * oneMinusExpKt;
        correntVY = roundToThree(correntVY);

        points.push({ x: x, y: y, vx: correntVX, vy: correntVY });
        t += dt;
    }
    return points;
}

function newVelocity(currentVelocity) {
    var e = getdata("e");
    var vx = currentVelocity[0];
    var vy = currentVelocity[1];

    // 新しい速度の計算（反発係数を考慮）
    var newVy = -vy * e;

    return [vx, newVy];
}

// グローバル関数
function draw(allways = 0) {
    allwayButton = getdata("常時描画");
    if (allways == 1 | allwayButton == 1) {
        allways = 1;
    }
    if (allways == 1) {
        var h = getdata("h");
        var intersectionData = drawCurve(0, h, null, "Curve");

        // curveList is list of label for Curves
        for (var i = 1; i < 10; i++) {
            var newVelocityXY = [intersectionData.vx, intersectionData.vy];
            newVelocityXY = newVelocity(newVelocityXY);
            var label = "curve" + i;
            intersectionData = drawCurve(intersectionData.x, 0, newVelocityXY, label);
        }
    }
}

function resetField() {
    var Sdis = ggbApplet.getValue("Sdis"); // 発射位置
    var fieldReset = ggbApplet.getValue("fieldReset ");
    var ballC = 0;
    var robot2C = 1;

    fieldAl = 3;
    fieldBl = 2.4;
    fieldCl = 6;
    // B to target 
    tarDis = 2.6;


    if (fieldReset == ballC) {
        resetPoint("B", Sdis);
        resetPoint("A", Sdis + fieldBl);
        resetPoint("target", Sdis - tarDis);

        resetPoint("fieldS", Sdis + fieldAl + fieldBl, -1);
        resetPoint("fieldE", Sdis - fieldCl, -1);
    }
    if (fieldReset == robot2C) {
        resetPoint("A", Sdis);
        resetPoint("B", Sdis + fieldBl);
        resetPoint("target", Sdis + (fieldBl + tarDis));

        resetPoint("fieldS", Sdis - fieldAl, -1);
        resetPoint("fieldE", Sdis + (fieldBl + fieldCl), -1);
    }
}

