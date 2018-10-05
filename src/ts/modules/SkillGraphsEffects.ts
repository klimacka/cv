
export class SkillGraphsEffects {

    private _resizeLock = false;
    private _graphItemElems: JQuery;

    constructor() {
        this._init();
    }

    private _init(): void {

        this._graphItemElems = $(".skill-list li");

        $(window).on("resize", () => {
            if (this._resizeLock) return;

            this._resizeLock = true;
            this._collapseGraphsAndStoreValue();
            setTimeout(() => {
                this._animateGraphsOnPage();
            }, 1200);
        });

        $(window).trigger("resize"); // do the effect once on page ready
    }

    private _collapseGraphsAndStoreValue(): void {
        this._graphItemElems.each((i, element) => {
            const graphElem = $(element);

            graphElem.data("originalWidth", graphElem.css("width"));
            graphElem.css("width", "1%");
        });
    }

    private _animateGraphsOnPage(): void {
        this._graphItemElems.each((i, element) => {
            const graphElem = $(element);

            graphElem.animate({ width: graphElem.data("originalWidth") }, 1000);
            this._resizeLock = false;
        });
    }

}
