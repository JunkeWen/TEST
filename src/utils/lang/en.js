const base = {
    epichust:'EpicHust',
    sign_in: 'Login',
    remember_me:'Remember me',
    username:'Username',
    username_change:'Please enter one username',
    password:'Password',
    password_change:'Please enter one password',
    new_password:'New Password',
    new_password_change:'Please enter one new_password',
    voice_announcements:'Message Reminder',
    audible_tone:'Audible Tone',
    email:'Email',
    factory:'Factory',
    workcenter:'WorkCenter',
    automatic_logon:'Automatic Login',
    binding_station:'Binding Station',
    switching_gateway:'Switching Gateway',
    switching_factories:'Switching factories',
    change_password:'Update Password',
    check_updates:'Check Updates',
    edit_menu:'Edit Menu',
    remote_control:'Remote Control',
    about:'About',
    quit:'Login Out',
    factory_list:'List of factories',
    workplace_list:'List of Workplace',
    save:'Save',
    check:'Check',
    resetting:'Reset',
    setting_network:'Setting Network',
    port:'Port',
    application_name:'Application Name',
    network_test:'Network Test',
    set_default:'Set Default',
    cancel:'Cancel',
    confirm_change:'Confirm Change',
    confirm:'Confirm',
    confirm_bind:'Confirm Bind',
    current_version:'Current Version',
    main_page:'Main Page',
    message:'Message',
    mine:'Mine',
    personal_info:'personal info',
    production_dep:'production department',
    info:'info',
    number:'quantity',
    qty:'Qty',
    binded_workstations:"Binded Workstations",
    workstation:'Workstation',
    binding_workstations:'Binding Workstations',
    prompt:'prompt',
    tips:'',
    on:'on',
    off:'off'
}

const pro = {
    personal:'personal',
    equip:'equip',
    production_dep:'production department',
    check:'check',
    process:'process',
    key_piece:'key piece',
    production:'production',
    effective_product:'effective',
    uneffective_product:'uneffective',

}
const chinese = {
    工位绑定: 'workCell',
    订单图表查看:'order view',
    生产报工:'production report',
    设备查询:'设备查询',
    设备检验项:'设备检验项',
    计划订单查询:'计划订单查询',
    设备任务单查询:'设备任务单查询',
    设备检验任务创建:'设备检验任务创建',
    设备点检:'设备点检',
    检测单创建:'检测单创建',
    检测单关闭:'检测单关闭',
    检测单录入:'检测单录入',
    设备异常发起:'设备异常发起',
    质量异常发起:'质量异常发起',
    物料异常发起:'物料异常发起',
    异常响应:'异常响应',
    异常处理:'异常处理',
    异常关闭:'异常关闭',
    异常查询:'异常查询',
}

const message = {
    message_network_success: 'This IP address is unobstructed',
    message_network_error: 'This IP address is not accessible',
    message_workcell_nobind:'There are no jobs that need to be bound this time.',
    message_workcell_resetsuccess:'Successful reset',
    message_workcell_load:'Loading...',
    message_editmenu_save:'Successful save',
    message_network_noip:'Please fill in the IP field.',
    message_network_nocheck:"You haven't verified whether the selected network is smooth, so are you sure you want to save and continue?",
    message_factory_isconfirm:'Are you sure you want to choose this factory?',
    message_login_inputusername:'please enter username',
    message_login_inputpassword:'Please fill in the password',
    message_login_networkerror:'network anomaly:',
    message_login_choosefactory:'Please select a factory',
    message_login_updateapp:'Force update APP, version number:',
    message_login_choose_factory:'Please select a factory',
    message_login_update_down:'Update download',
    message_login_update_downing:'Update is downloading...',
    message_login_update_error:'Download failed',
    message_login_appversion:'Your version is too high, please uninstall and reinstall the current version.',
    message_mine_lastappversion:'Your current version is the latest version and does not need to be updated!',
    message_mine_quitout:'Confirm exit?',
    message_login_networktip:'Please check if your IP port is correct',
}

const network = {
    network_one: 'Network I',
    network_two: 'Network II',
}


    const abnormal ={
        exception_number:"Exception number",
        abnormal_large_type:"Abnormal large type",
        exception_content:"Exception content",
        initiate_information:"Initiate information",
        abnormally_small_type:"Abnormally small type",
        sponsor:"sponsor",
        starting_time:"Starting time",
        exception_description:"Exception description",
        response_message:"Response message",
        responder:"responder",
        response_time:"Response time",
        response_note:"Response note",
        processing_information:"Processing information",
        processing_person:"Processing person",
        processing_time:"Processing time",
        treatment:"treatment",
        processing_notes:"Processing notes",
        close_message:"Close message",
        close_person:"Close person",
        closing_time:"Closing time",
        close_note:"Close note",
        listof_exception_handling_measures:"List of exception handling measures",
        listof_abnormal_causes:"List of abnormal causes",
        edit_information:"Edit information",
        whether_to_transfer:"Whether to transfer",
        transfer_note:"Transfer note",
        abnormal_measures:"Abnormal Measures",
        remarks:"remarks",
        abnormal:"abnormal",
        whether_to_close:"Whether to close"
    }

export {
    base,pro,chinese,message,network,abnormal
}