// 変数の取得
var fieldReset = ggbApplet.getValue("fieldReset");
var ballC = 0;
var robot2C = 1;

// 条件による値の設定
if (fieldReset == robot2C) {
    ggbApplet.SetValue("h", 0.8);
    ggbApplet.SetValue("v", 8);
    ggbApplet.SetValue("k", 0.34);
    ggbApplet.SetValue("e", 0.07);
    ggbApplet.SetValue("Sdis", 0.5);
    ggbApplet.SetValue("h", 0.6);
} else if (fieldReset == ballC) {
    ggbApplet.SetValue("h", 0.2);
    ggbApplet.SetValue("v", 5.2);
    ggbApplet.SetValue("k", 0.14);
    ggbApplet.SetValue("e", 0.89);
    ggbApplet.SetValue("Sdis", 0.2);
    ggbApplet.SetValue("h", 0.24);
}

ggbApplet.SetValue("a", 45);
resetField();
draw();
