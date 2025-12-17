export class ResourceUtil {
    cleanUp(resource: any) {
        if (resource && typeof resource.destroy === 'function') {
            resource.destroy();
        }
        resource = null;
    }

    cleanUpArray(resourceArr: any[]) {
        if (!Array.isArray(resourceArr)) return;
        for (let i = 0; i < resourceArr.length; i++) {
            this.cleanUp(resourceArr[i]);
        }
        resourceArr = null;
    }
}
