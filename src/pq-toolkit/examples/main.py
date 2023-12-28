import uvicorn

from api import PqToolkitAPI

pq = PqToolkitAPI()


if __name__ == "__main__":
    # test_setup = PqTestSetup(
    #     name="Test py",
    #     title="Example test generated from python API",
    #     tests=[
    #         PqTest(
    #             id=1, type=PqTestTypes.AB,
    #             samples=[
    #                 PqSample(
    #                     id="a", asset_path="samples/file_sample_5.mp3"
    #                 ),
    #                 PqSample(
    #                     id="b", asset_path="samples/file_sample_700.mp3"
    #                 )
    #             ],
    #             questions=[
    #                 PqQuestion(
    #                     text="Select worse quality"
    #                 )
    #             ]
    #         )
    #     ]
    # )
    # print(test_setup.model_dump_json(by_alias=True, indent=4))

    uvicorn.run("main:pq", host="localhost", port=8080)