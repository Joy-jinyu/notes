validateAjax()

function validateAjax() {
    // $.ajax({
    //     method: 'post',
    //     url: 'https://translation.googleapis.com/language/translate/v9',
    //     data: {
    //         q: '中文',
    //         target: 'en',
    //         format: 'html',
    //         key: 'AIzaSyBEOFH0zbU3B6PUpcSwVMAisL4B12GrxWQ'
    //     },
    //     dataType: 'json',
    //     success: function() {
    //         console.log("成功")
    //     },
    //     error: function() {
    //         console.log("失敗")
    //     }
    // })
    
    const post = $.post(
        'https://translation.googleapis.com/language/translate/v9',
        {
            q: '中文',
            target: 'en',
            format: 'html',
            key: 'AIzaSyBEOFH0zbU3B6PUpcSwVMAisL4B12GrxWQ'
        }
    )
    post.done((data) => {
        console.log(data)
    }).fail(function(xhr, status, error) {
        console.log(xhr.status, status, 'ss')
    })
}