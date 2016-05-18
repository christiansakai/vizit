app.controller('RevisionCtrl', function ($scope, revision, code, CodeFactory, $state) {
    console.log(code);
    $scope.original = revision;
    $scope.revision = angular.extend({}, $scope.original);

    $scope.code = code;

    $scope.save = function () {
        let newEdit = true;
        $scope.code.revisions.forEach(function (rev) {
            if (rev.content === $scope.revision.content) newEdit = false;
        })
        if (newEdit) {
            CodeFactory.addRevision($scope.code._id, $scope.revision.content)
            .then(function (revisedCode) {
                console.log(revisedCode);
                $state.go('revision', {codeId: revisedCode._id, revisionNum: revisedCode.revisions.length-1})
            })
        }
    }
});
