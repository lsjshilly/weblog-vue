
import nProgress from "nprogress";


export function showPageLoading() {
    nProgress.start();
}

export function hidePageLoading() {
    nProgress.done();
}