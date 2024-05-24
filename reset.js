// 値の設定
ggbApplet.setValue("a", 45.0);
ggbApplet.setValue("g", 9.8);

// 変数の取得
var fieldReset = ggbApplet.getValue("fieldReset");
var ballC = 0;
var robot2C = 1;

// 条件による値の設定
if (fieldReset == robot2C) {
    ggbApplet.setValue("h", 0.8);
    ggbApplet.setValue("v", 8);
    ggbApplet.setValue("k", 0.24);
    ggbApplet.setValue("e", 0.07);
    ggbApplet.setValue("Sdis", 0.5);
ggbApplet.setValue("h", 0.6);
}
if (fieldReset == ballC) {
    ggbApplet.setValue("h", 0.2);
    ggbApplet.setValue("v", 5.2);
    ggbApplet.setValue("k", 0.14);
    ggbApplet.setValue("e", 0.89);
ggbApplet.setValue("Sdis", 0.2);
ggbApplet.setValue("h", 0.24);
}
