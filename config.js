"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    tables: {
        users: "ProjectStackUsers",
        projects: "ProjectStackAllProjects",
        projectUserTable: "ProjectStackUserProjectRel",
        projectJoinRequest: "projectStackJoinRequests",
        notificationsTable: "projectStackNotifications"
    },
    elasticsearch: {
        endpoint: "https://search-teamslounge-k2eyqwt5ivv2oyonhl42eru7oq.us-east-1.es.amazonaws.com/",
        indices: {
            users: 'users',
            projects: 'projects',
            projectsEnrollments: 'projects_enrollments',
            joinRequests: 'join_requests',
            notification: 'notifications'
        },
        searchPageSize: 10
    },
    encryptKey: "Gosh",
    hashSalt: "IbrahimRahhal",
    buckets: {
        userProfile: 'projectstack.users.profile.images',
        userResumes: 'projectstack.users.resumes'
    },
    getBucketBaseUrl(name) {
        return `https://s3.amazonaws.com/${name}/`;
    },
    disableAuth: false,
    disableEncryption: true
};
//# sourceMappingURL=config.js.map