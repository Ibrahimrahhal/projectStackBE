export default {
    tables:{
        users: "ProjectStackUsers",
        projects: "ProjectStackAllProjects",
        projectUserTable: "ProjectStackUserProjectRel",
        projectInvitations: "ProjectStackInvitations",
        projectJoinRequest: "ProjectStackRequests",
        usersNotificationsTable: "projectStackUsersNotifications"
    },
    encryptKey: "Gosh",
    hashSalt: "IbrahimRahhal",
    buckets:{
        userProfile: 'projectstack.users.profile.images',
        userResumes: 'projectstack.users.resumes'
    },
    getBucketBaseUrl(name:string){
        return `https://s3.amazonaws.com/${name}/`
    },
    disableAuth:false,
    disableEncryption:false
};